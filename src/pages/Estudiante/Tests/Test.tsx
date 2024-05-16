import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { TableGeneral } from '../../../components/Tables/TableGeneral';
import { SessionContext } from '../../../Context/SessionContext';
import { useContext } from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';

const HomeEstudiante = () => {
  const listadoTests = [
    { titulo: 'Kolb', descripcion: 'Jan 9, 2014' },
    { titulo: 'Honney y Alonso', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
    { titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { titulo: 'Kinestésico', descripcion: 'Jan 9, 2014' },
    { titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
  ];

  const theme = createTheme({
    components: {
      MuiListItemText: {
        styleOverrides: {
          primary: {
            color: '',
            fontWeight: 'bold',
          },
          secondary: {
            color: 'gray',
          },
        },
      },
    },
  });
  // const {login,logout,isLoggedIn} = useContext(SessionContext)

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tests" />
      <div className='flex flex-col gap-8'>
        <h3 className="text-xl font-semibold text-black dark:text-white">Tests asignados</h3>
        <ThemeProvider theme={theme}>
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            className="grid grid-cols-1 lg:grid-cols-2 cursor-pointer rounded-lg bg-stroke dark:bg-boxdark"
          >
            {listadoTests.map((test) => (
              <ListItem
                className="flex gap-8 hover:bg-black m-5 rounded-lg text-black dark:text-slate-400 hover:text-white dark:hover:text-white"
                sx={{ width: '93%', minWidth: 280 }}
              >
                <ListItemAvatar className="">
                  <Avatar style={{ width: '75px', height: '75px' }}>
                    {/* {icono == 'test' && ( */}
                    <PsychologySharpIcon
                      style={{ width: '70px', height: '70px' }}
                      className="text-black"
                    />
                    {/* )} */}
                    {/* {icono == 'curso' && (
                    <SchoolRoundedIcon
                      style={{ width: '65px', height: '65px' }}
                      className="text-black"
                    />
                  )} */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  style={{
                    width: '100px',
                    whiteSpace: 'wrap',
                    textAlign: 'center',
                  }}
                  primary={test.titulo}
                  secondary={test.descripcion}
                />
              </ListItem>
            ))}
          </List>
        </ThemeProvider>
      </div>
    </DefaultLayout>
  );
};

export default HomeEstudiante;
