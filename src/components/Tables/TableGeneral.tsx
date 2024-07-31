import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Button, createTheme, IconButton, ThemeProvider } from '@mui/material';
import PsychologySharpIcon from '@mui/icons-material/PsychologySharp';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import Stack from '@mui/material/Stack';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useNavigate } from 'react-router-dom';

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

interface Dato {
  titulo: string;
  descripcion: string;
}

interface Props {
  listado: Dato[];
  titulo: string;
  icono: string;
  crear?: boolean;
  path?: string;
  mensaje?: string;
}

export const TableGeneral: React.FC<Props> = ({
  listado,
  titulo,
  icono,
  crear = 'true',
  path,
  mensaje,
}) => {
  const navigate = useNavigate();

  const redirectTo = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="rounded-xl opacity-85 border border-stroke bg-white px-5 pt-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between mb-2">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {titulo}
        </h4>
        {crear && (
          <Stack direction="row" spacing={1}>
            <Button
              style={{ color: 'black' }}
              variant="contained"
              color="inherit"
              startIcon={<AddCircleOutlineRoundedIcon />}
              onClick={redirectTo}
            >
              <div className="text-black font-bold">Añadir</div>
            </Button>
          </Stack>
        )}
      </div>
      <ThemeProvider theme={theme}>
        <List
          sx={{ width: '100%', bgcolor: 'background.paper' }}
          className="flex overflow-auto cursor-pointer bg-stroke dark:bg-boxdark"
        >
          {listado.length > 0 ? (
            listado.map((test) => (
              <ListItem
                className="flex gap-3 hover:bg-black rounded-lg text-black dark:text-slate-400 hover:text-white dark:hover:text-white"
                sx={{ width: '100%', minWidth: 280 }}
              >
                <ListItemAvatar className="">
                  <Avatar style={{ width: '75px', height: '75px' }}>
                    {icono == 'test' && (
                      <PsychologySharpIcon
                        style={{ width: '70px', height: '70px' }}
                        className="text-black"
                      />
                    )}
                    {icono == 'curso' && (
                      <SchoolRoundedIcon
                        style={{ width: '65px', height: '65px' }}
                        className="text-black"
                      />
                    )}
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
            ))
          ) : (
            <div className="font-bold text-xl">{mensaje}</div>
          )}
        </List>
      </ThemeProvider>
    </div>
  );
};
