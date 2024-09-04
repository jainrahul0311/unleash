import { styled, Typography, useTheme } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { CREATE_FEATURE } from 'component/providers/AccessProvider/permissions';
import { FlagCreationButton } from '../ProjectFeatureTogglesHeader/ProjectFeatureTogglesHeader';
import ResponsiveButton from 'component/common/ResponsiveButton/ResponsiveButton';
import useProjectOverview from 'hooks/api/getters/useProjectOverview/useProjectOverview';
import { useFeature } from 'hooks/api/getters/useFeature/useFeature';
import { getFeatureTypeIcons } from 'utils/getFeatureTypeIcons';
import { Link } from 'react-router-dom';
import { HtmlTooltip } from 'component/common/HtmlTooltip/HtmlTooltip';
import useFeatureTypes from 'hooks/api/getters/useFeatureTypes/useFeatureTypes';

interface IWelcomeToProjectProps {
    projectId: string;
}

interface IExistingFlagsProps {
    featureId: string;
    projectId: string;
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    flexBasis: '70%',
    borderRadius: theme.shape.borderRadiusLarge,
}));

const TitleBox = styled('div')(({ theme }) => ({
    padding: theme.spacing(2, 7, 2, 7),
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
}));

const Actions = styled('div')(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
}));

const ActionBox = styled('div')(({ theme }) => ({
    flexBasis: '50%',
    padding: theme.spacing(3, 2, 6, 8),
    display: 'flex',
    gap: theme.spacing(3),
    flexDirection: 'column',
}));

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
    fontSize: theme.spacing(1.75),
    fontWeight: 'bold',
}));

const NeutralCircleContainer = styled('span')(({ theme }) => ({
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.neutral.border,
    borderRadius: '50%',
}));

const MainCircleContainer = styled(NeutralCircleContainer)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
}));

const TypeCircleContainer = styled(MainCircleContainer)(({ theme }) => ({
    borderRadius: '20%',
}));

const StyledLink = styled(Link)({
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'center',
});

export const WelcomeToProject = ({ projectId }: IWelcomeToProjectProps) => {
    const { project } = useProjectOverview(projectId);
    const isFirstFlagCreated =
        project.onboardingStatus.status === 'first-flag-created';

    return (
        <Container>
            <TitleBox>
                <Typography fontWeight='bold'>
                    Welcome to your project
                </Typography>
                <Typography variant='body2'>
                    Complete the steps below to start working with this project
                </Typography>
            </TitleBox>
            <Actions>
                <ActionBox>
                    {project.onboardingStatus.status ===
                    'first-flag-created' ? (
                        <ExistingFlag
                            projectId={projectId}
                            featureId={project.onboardingStatus.feature}
                        />
                    ) : (
                        <CreateFlag />
                    )}
                </ActionBox>
                <ActionBox>
                    <TitleContainer>
                        <NeutralCircleContainer>2</NeutralCircleContainer>
                        Connect an SDK
                    </TitleContainer>
                    <Typography>
                        We have not detected any connected SDKs on this project.
                    </Typography>
                    <ResponsiveButton
                        onClick={() => {}}
                        maxWidth='200px'
                        projectId={projectId}
                        Icon={Add}
                        disabled={!isFirstFlagCreated}
                        permission={CREATE_FEATURE}
                    >
                        Connect SDK
                    </ResponsiveButton>
                </ActionBox>
            </Actions>
        </Container>
    );
};

const CreateFlag = () => {
    return (
        <>
            <TitleContainer>
                <NeutralCircleContainer>1</NeutralCircleContainer>
                Create a feature flag
            </TitleContainer>
            <Typography>
                <div>The project currently holds no feature toggles.</div>
                <div>Create a feature flag to get started.</div>
            </Typography>
            <FlagCreationButton />
        </>
    );
};

const ExistingFlag = ({ featureId, projectId }: IExistingFlagsProps) => {
    const theme = useTheme();
    const { feature } = useFeature(projectId, featureId);
    const { featureTypes } = useFeatureTypes();
    const IconComponent = getFeatureTypeIcons(feature.type);
    const typeName = featureTypes.find(
        (featureType) => featureType.id === feature.type,
    )?.name;
    const typeTitle = `${typeName || feature.type} flag`;

    return (
        <>
            <TitleContainer>
                <MainCircleContainer>✓</MainCircleContainer>
                Create a feature flag
            </TitleContainer>
            <TitleContainer>
                <HtmlTooltip arrow title={typeTitle} describeChild>
                    <TypeCircleContainer>
                        <IconComponent />
                    </TypeCircleContainer>
                </HtmlTooltip>
                <StyledLink
                    to={`/projects/${projectId}/features/${feature.name}`}
                >
                    {feature.name}
                </StyledLink>
            </TitleContainer>
            <Typography>
                Your project is not yet connected to any SDK. In order to start
                using your feature flag connect an SDK to the project.
            </Typography>
        </>
    );
};