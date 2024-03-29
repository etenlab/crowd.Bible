import { Button, DiFilter, DiMessages, MuiMaterial } from '@eten-lab/ui-kit';

const { Typography, styled } = MuiMaterial;

export const StyledSectionTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.gray,
  fontWeight: 800,
  fontSize: '14px',
  lineHeight: '20px',
  textTransform: 'uppercase',
  padding: '15px 0px',
  letterSpacing: '0.05em',
  paddingTop: '20px',
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StyledButtonProps = HTMLButtonElement & any;
export const StyledFilterButton = styled((props: StyledButtonProps) => (
  <Button {...props}>
    <DiFilter />
  </Button>
))(({ theme }) => ({
  backgroundColor: theme.palette.text['light-blue'],
  padding: '9px',
  borderRadius: '5px',
  minWidth: 'fit-content',
  ':hover': {
    backgroundColor: theme.palette.text['light-blue'],
  },
}));
