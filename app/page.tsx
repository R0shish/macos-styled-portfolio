import Desktop from "./components/desktop/desktop";
import { FloatingDock } from "./components/dock/floating-dock";
import Menubar from "./components/menubar/menubar";
import Image from "next/image";
import Window from "./components/window/window";
import Wallpaper from "./assets/images/wallpaper.jpg";

export default function Home() {
  return (
    <main>
      <div className="relative h-screen w-screen overflow-hidden">
        <div className="absolute top-0 left-0 z-10 w-full h-full">
          <Menubar />
          <Desktop />
          <Window />
        </div>
        <div className="absolute bottom-4 z-10 w-full flex justify-center">
          <FloatingDock />
        </div>
        <Image src={Wallpaper} alt="wallpaper" fill />
      </div>
    </main>
  );
}
