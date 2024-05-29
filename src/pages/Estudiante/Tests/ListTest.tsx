import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../layout/DefaultLayout';
import { TableGeneral } from '../../../components/Tables/TableGeneral';
import { SessionContext } from '../../../Context/SessionContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ListTest = () => {
  const navigate = useNavigate();
  const listadoTests = [
    { id: 1, titulo: 'Kolb', descripcion: 'Jan 9, 2014' },
    { id: 2, titulo: 'Honney y Alonso', descripcion: 'Jan 9, 2014' },
    { id: 3, titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { id: 4, titulo: 'Kinestésico Kinestésico', descripcion: 'Jan 9, 2014' },
    { id: 5, titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
    { id: 6, titulo: 'Sperry', descripcion: 'Jan 9, 2014' },
    { id: 7, titulo: 'Kinestésico', descripcion: 'Jan 9, 2014' },
    { id: 8, titulo: 'Mumford', descripcion: 'Jan 9, 2014' },
  ];

  const handleSelectTest = (idTest: number) => {
    console.log('ID TEST:' + idTest);
    navigate("/test/"+idTest);
    return true;
  };

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
      <div className="flex flex-col gap-8">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Tests asignados
        </h3>
        <ThemeProvider theme={theme}>
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            className="grid grid-cols-1 lg:grid-cols-2 cursor-pointer rounded-lg bg-stroke dark:bg-boxdark"
          >
            {listadoTests.map((test) => (
              <ListItem
                className="flex gap-8 hover:bg-black m-5 rounded-lg text-black dark:text-slate-400 hover:text-white dark:hover:text-white"
                sx={{ width: '93%', minWidth: 280 }}
                onClick={() => handleSelectTest(test.id)}
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

export default ListTest;
