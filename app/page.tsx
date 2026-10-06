import Providers from "./providers";
import Desktop from "./components/desktop/desktop";
import Dock from "./components/dock/dock";
import Menubar from "./components/menubar/menubar";
import WindowManager from "./components/window/window-manager";
import Wallpaper from "./components/system/wallpaper";
import Spotlight from "./components/spotlight/spotlight";
import Notifications from "./components/system/notifications";
import BrightnessOverlay from "./components/system/brightness-overlay";
import PowerScreen from "./components/system/power-screen";
import Launcher from "./components/launcher/launcher";

export default function Home() {
  return (
    <Providers>
      <main className="relative h-screen w-screen overflow-hidden">
        <Wallpaper />
        <Desktop />
        <WindowManager />
        <div className="absolute bottom-2 z-dock w-full flex justify-center pointer-events-none [&>*]:pointer-events-auto">
          <Dock />
        </div>
        <Launcher />
        <div className="absolute top-0 inset-x-0 z-menubar pointer-events-none [&>*]:pointer-events-auto">
          <Menubar />
        </div>
        <Spotlight />
        <Notifications />
        <BrightnessOverlay />
        <PowerScreen />
      </main>
    </Providers>
  );
}
