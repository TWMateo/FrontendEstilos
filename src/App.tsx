import { useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from '../src/pages/Docente/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Docente/Profile';
import Settings from './pages/Settings';
import Home from './pages/Docente/Home';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Models from './pages/Docente/IModels/Models';
import Course from './pages/Docente/Course';
import HomeEstudiante from './pages/Estudiante/HomeEstudiante';
import ProfileEstudiante from './pages/Estudiante/ProfileEstudiante';
import { SessionContext } from './Context/SessionContext';
import Test from '../src/pages/Estudiante/Tests/Test';
import TestResults from '../src/pages/Estudiante/Tests/TestResults';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const { pathname } = useLocation();
  const { isLoggedIn, userContext, passwordContext, rolContext, login } =
    useContext(SessionContext);

  const handleLogin = () => {
    if (isLoggedIn) {
      login();
      loadingContent();
    }
  };

  const loadingContent = () => {
    setIsLoadingContent(true);
    setTimeout(() => setIsLoadingContent(false), 2000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : isLoggedIn ? (
    isLoadingContent ? (
      <Loader />
    ) : rolContext == 'Docente' ? (
      <>
        <Routes>
          <Route
            index
            element={
              <>
                <PageTitle title="Inicio | UTN" />
                <Home />
              </>
            }
          />
          <Route
            path="/perfil"
            element={
              <>
                <PageTitle title="Perfil" />
                <Profile />
              </>
            }
          />
          <Route
            path="/modelos/nuevo/test"
            element={
              <>
                <PageTitle title="Modelos" />
                <Models />
              </>
            }
          />
          <Route
            path="/curso"
            element={
              <>
                <PageTitle title="Cursos" />
                <Course />
              </>
            }
          />
          <Route
            path="/chart"
            element={
              <>
                <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Chart />
              </>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <>
                <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Alerts />
              </>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <>
                <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <Buttons />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn handleLogin={handleLogin} />
              </>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            }
          />
        </Routes>
      </>
    ) : rolContext == 'Estudiante' ? (
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Inicio | UTN" />
              <HomeEstudiante />
            </>
          }
        />
        <Route
          path="/perfil"
          element={
            <>
              <PageTitle title="Perfil | Estudiante" />
              <ProfileEstudiante />
            </>
          }
        />
        <Route
          path="/test"
          element={
            <>
              <PageTitle title="Test | Estudiante" />
              <Test />
            </>
          }
        />
         <Route
          path="/resultados"
          element={
            <>
              <PageTitle title="Resultados | Estudiante" />
              <TestResults />
            </>
          }
        />
      </Routes>
    ) : rolContext == 'Administrador' ? (
      <div>Admin</div>
    ) : (
      rolContext == 'Pruebas' && (
        <>
          <Routes>
            <Route
              index
              element={
                <>
                  <PageTitle title="Inicio | UTN" />
                  <Home />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <ECommerce />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/perfil"
              element={
                <>
                  <PageTitle title="Perfil" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/modelos/nuevo/test"
              element={
                <>
                  <PageTitle title="Modelos" />
                  <Models />
                </>
              }
            />
            <Route
              path="/curso"
              element={
                <>
                  <PageTitle title="Cursos" />
                  <Course />
                </>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            />
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignIn handleLogin={handleLogin} />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignUp />
                </>
              }
            />
          </Routes>
        </>
      )
    )
  ) : (
    <SignIn handleLogin={handleLogin} />
  );
}

export default App;
