import Image from "next/image";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-left">
        <a href="#" className="flex items-center space-x-2 w-2/12">
          <Image
            src="/vaca.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-xl font-bold">Rastreio de Gado</span>
        </a>
        <div className="space-x-4 w-8/12 flex justify-center">
          <a href="/" className="hover:text-gray-300">Início</a>
          <a href="/localizacoes" className="hover:text-gray-300">Localizações</a>
          <a href="/animais" className="hover:text-gray-300">Animais</a>
          <a href="/piquetes" className="hover:text-gray-300">Piquetes</a>
        
          <a href="/propriedades" className="hover:text-gray-300">Propriedades</a>
          <a href="/dispositivos" className="hover:text-gray-300">Dispositivos</a>
          <a href="/users" className="hover:text-gray-300">Users</a>
        </div>

        <div className="w-2/12">

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
