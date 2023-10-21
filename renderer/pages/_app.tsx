import '@/styles/globals.scss';
import "@/styles/adultos.scss";
import "@/styles/adultosreportes.scss";
import "@/styles/casosaccion.scss";
import "@/styles/casoscomponents.scss";
import "@/styles/casosnuevocaso.scss";
import "@/styles/casosreportes.scss";
import "@/styles/dashboard.scss";
import "@/styles/dashboardcomponents.scss";
import "@/styles/hijos.scss";
import "@/styles/login.scss";
import "@/styles/main.scss";
import "@/styles/personalagregar.scss";
import "@/styles/profile.scss";
import "@/styles/usuarios.scss";
import "@/styles/usuariosagregar.scss";
import "@/styles/usuarioscomponents.scss";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
