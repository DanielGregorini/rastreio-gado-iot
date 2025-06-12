import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 flex">
      <div>
        <div className="p-3">Equipe: Daniel, William e Cayo</div>
        <div>
          <Image
            src="/equipe.png"
            alt="Logo"
            width={300}
            height={270}
            className="rounded"
          />
        </div>
      </div>

      <div className="container mx-auto text-center">
        <p>&copy; 2025 Rastreio de Gado App. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;