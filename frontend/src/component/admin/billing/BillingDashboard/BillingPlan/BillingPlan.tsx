import type { FC } from 'react';
import { useMemo } from 'react';
import { Alert, Divider, Grid, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { useUsers } from 'hooks/api/getters/useUsers/useUsers';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import {
    type IInstanceStatus,
    InstanceState,
    InstancePlan,
} from 'interfaces/instance';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';
import { trialHasExpired, isTrialInstance } from 'utils/instanceTrial';
import { GridRow } from 'component/common/GridRow/GridRow';
import { GridCol } from 'component/common/GridCol/GridCol';
import { Badge } from 'component/common/Badge/Badge';
import { GridColLink } from './GridColLink/GridColLink';
import { useTrafficDataEstimation } from 'hooks/useTrafficData';
import { useInstanceTrafficMetrics } from 'hooks/api/getters/useInstanceTrafficMetrics/useInstanceTrafficMetrics';

const StyledPlanBox = styled('aside')(({ theme }) => ({
    padding: theme.spacing(2.5),
    height: '100%',
    borderRadius: theme.shape.borderRadiusLarge,
    boxShadow: theme.boxShadows.elevated,
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6.5),
    },
}));

const StyledInfoLabel = styled(Typography)(({ theme }) => ({
    fontSize: theme.fontSizes.smallBody,
    color: theme.palette.text.secondary,
}));

const StyledPlanSpan = styled('span')(({ theme }) => ({
    fontSize: '3.25rem',
    lineHeight: 1,
    color: theme.palette.primary.main,
    fontWeight: 800,
}));

const StyledTrialSpan = styled('span')(({ theme }) => ({
    marginLeft: theme.spacing(1.5),
    fontWeight: theme.fontWeight.bold,
}));

const StyledPriceSpan = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: theme.fontSizes.mainHeader,
    fontWeight: theme.fontWeight.bold,
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
    fontSize: theme.fontSizes.smallerBody,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-1.5),
    [theme.breakpoints.up('md')]: {
        marginTop: theme.spacing(-4.5),
    },
}));

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => ({
    fontSize: '1rem',
    marginRight: theme.spacing(1),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    margin: `${theme.spacing(3)} 0`,
}));

interface IBillingPlanProps {
    instanceStatus: IInstanceStatus;
}

const proPlanIncludedRequests = 53_000_000;

export const BillingPlan: FC<IBillingPlanProps> = ({ instanceStatus }) => {
    const { users, loading } = useUsers();
    const expired = trialHasExpired(instanceStatus);
    const { isPro } = useUiConfig();

    const {
        currentPeriod,
        toChartData,
        toTrafficUsageSum,
        endpointsInfo,
        getDayLabels,
        calculateOverageCost,
    } = useTrafficDataEstimation();

    const eligibleUsers = users.filter((user: any) => user.email);

    const price = {
        [InstancePlan.PRO]: 80,
        [InstancePlan.COMPANY]: 0,
        [InstancePlan.TEAM]: 0,
        [InstancePlan.ENTERPRISE]: 0,
        [InstancePlan.UNKNOWN]: 0,
        user: 15,
    };

    const planPrice = price[instanceStatus.plan];
    const seats = instanceStatus.seats ?? 5;

    const freeAssigned = Math.min(eligibleUsers.length, seats);
    const paidAssigned = eligibleUsers.length - freeAssigned;
    const paidAssignedPrice = price.user * paidAssigned;
    const includedTraffic = isPro() ? proPlanIncludedRequests : 0;
    const traffic = useInstanceTrafficMetrics(currentPeriod.key);

    const overageCost = useMemo(() => {
        if (!includedTraffic) {
            return 0;
        }
        const trafficData = toChartData(
            getDayLabels(currentPeriod.dayCount),
            traffic,
            endpointsInfo,
        );
        const totalTraffic = toTrafficUsageSum(trafficData);
        return calculateOverageCost(totalTraffic, includedTraffic);
    }, [includedTraffic, traffic, currentPeriod, endpointsInfo]);

    const totalCost = planPrice + paidAssignedPrice + overageCost;

    const inactive = instanceStatus.state !== InstanceState.ACTIVE;

    if (loading) return null;

    return (
        <Grid item xs={12} md={7}>
            <StyledPlanBox>
                <ConditionallyRender
                    condition={inactive}
                    show={
                        <StyledAlert severity='info'>
                            After you have sent your billing information, your
                            instance will be upgraded - you don't have to do
                            anything.{' '}
                            <a href='mailto:support@getunleash.io?subject=PRO plan clarifications'>
                                Get in touch with us
                            </a>{' '}
                            for any clarification
                        </StyledAlert>
                    }
                />
                <Badge color='success'>Current plan</Badge>
                <Grid container>
                    <GridRow
                        sx={(theme) => ({ marginBottom: theme.spacing(3) })}
                    >
                        <GridCol>
                            <StyledPlanSpan>
                                {instanceStatus.plan}
                            </StyledPlanSpan>
                            <ConditionallyRender
                                condition={isTrialInstance(instanceStatus)}
                                show={
                                    <StyledTrialSpan
                                        sx={(theme) => ({
                                            color: expired
                                                ? theme.palette.error.dark
                                                : theme.palette.warning.dark,
                                        })}
                                    >
                                        {expired
                                            ? 'Trial expired'
                                            : instanceStatus.trialExtended
                                              ? 'Extended Trial'
                                              : 'Trial'}
                                    </StyledTrialSpan>
                                }
                            />
                        </GridCol>
                        <GridCol>
                            <ConditionallyRender
                                condition={planPrice > 0}
                                show={
                                    <StyledPriceSpan>
                                        ${planPrice.toFixed(2)}
                                    </StyledPriceSpan>
                                }
                            />
                        </GridCol>
                    </GridRow>
                </Grid>
                <ConditionallyRender
                    condition={Boolean(
                        instanceStatus.plan === InstancePlan.PRO,
                    )}
                    show={
                        <>
                            <Grid container>
                                <GridRow
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(1.5),
                                    })}
                                >
                                    <GridCol vertical>
                                        <Typography>
                                            <strong>Included members</strong>
                                            <GridColLink>
                                                <Link to='/admin/users'>
                                                    {freeAssigned} of 5 assigned
                                                </Link>
                                            </GridColLink>
                                        </Typography>
                                        <StyledInfoLabel>
                                            You have 5 team members included in
                                            your PRO plan
                                        </StyledInfoLabel>
                                    </GridCol>
                                    <GridCol>
                                        <StyledCheckIcon />
                                        <Typography variant='body2'>
                                            included
                                        </Typography>
                                    </GridCol>
                                </GridRow>
                                <GridRow
                                    sx={(theme) => ({
                                        marginBottom: theme.spacing(1.5),
                                    })}
                                >
                                    <GridCol vertical>
                                        <Typography>
                                            <strong>Paid members</strong>
                                            <GridColLink>
                                                <Link to='/admin/users'>
                                                    {paidAssigned} assigned
                                                </Link>
                                            </GridColLink>
                                        </Typography>
                                        <StyledInfoLabel>
                                            $15/month per paid member
                                        </StyledInfoLabel>
                                    </GridCol>
                                    <GridCol>
                                        <Typography
                                            sx={(theme) => ({
                                                fontSize:
                                                    theme.fontSizes.mainHeader,
                                            })}
                                        >
                                            ${paidAssignedPrice.toFixed(2)}
                                        </Typography>
                                    </GridCol>
                                </GridRow>
                                <ConditionallyRender
                                    condition={overageCost > 0}
                                    show={
                                        <GridRow>
                                            <GridCol vertical>
                                                <Typography>
                                                    <strong>
                                                        Accrued traffic charges
                                                    </strong>
                                                    <GridColLink>
                                                        <Link to='/admin/network/data-usage'>
                                                            view details
                                                        </Link>
                                                    </GridColLink>
                                                </Typography>
                                                <StyledInfoLabel>
                                                    $5 dollar per 1 million
                                                    started above included data
                                                </StyledInfoLabel>
                                            </GridCol>
                                            <GridCol>
                                                <Typography
                                                    sx={(theme) => ({
                                                        fontSize:
                                                            theme.fontSizes
                                                                .mainHeader,
                                                    })}
                                                >
                                                    ${overageCost.toFixed(2)}
                                                </Typography>
                                            </GridCol>
                                        </GridRow>
                                    }
                                />
                            </Grid>
                            <StyledDivider />
                            <Grid container>
                                <GridRow>
                                    <GridCol>
                                        <Typography
                                            sx={(theme) => ({
                                                fontWeight:
                                                    theme.fontWeight.bold,
                                                fontSize:
                                                    theme.fontSizes.mainHeader,
                                            })}
                                        >
                                            Total
                                        </Typography>
                                    </GridCol>
                                    <GridCol>
                                        <Typography
                                            sx={(theme) => ({
                                                fontWeight:
                                                    theme.fontWeight.bold,
                                                fontSize: '2rem',
                                            })}
                                        >
                                            ${totalCost.toFixed(2)}
                                        </Typography>
                                    </GridCol>
                                </GridRow>
                            </Grid>
                        </>
                    }
                />
            </StyledPlanBox>
        </Grid>
    );
};
