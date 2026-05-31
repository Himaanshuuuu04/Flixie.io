"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "../components/Redux/Store";
import { BackgroundGradientAnimation } from "../components/Gradient";
import { SparklesCore } from "../components/SparkleText";
import ReduxBootstrap from "../components/Redux/ReduxBootstrap";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundGradientAnimation
      className="relative min-h-screen w-full"
      containerClassName="min-h-screen w-full"
    >
      <div className="fixed inset-0 pointer-events-none h-screen w-screen overflow-hidden">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.2}
          maxSize={1}
          particleDensity={40}
          className="h-full w-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>
      <Provider store={store}>
        <ReduxBootstrap>{children}</ReduxBootstrap>
      </Provider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BackgroundGradientAnimation>
  );
}
