import React from 'react';

const Reportes = () => {
    const reportes = [
    // Líderes
    { titulo: "Inventario de Líderes 1", archivo: "INV_LIDERES1.pdf", descripcion: "Reporte detallado de líderes - parte 1." },
    { titulo: "Inventario de Líderes 2", archivo: "INV_LIDERES2.pdf", descripcion: "Reporte detallado de líderes - parte 2." },
    { titulo: "Inventario de Líderes 3", archivo: "INV_LIDERES3.pdf", descripcion: "Reporte detallado de líderes - parte 3." },
    { titulo: "Inventario de Líderes 4", archivo: "INV_LIDERES4.pdf", descripcion: "Reporte detallado de líderes - parte 4." },
    { titulo: "Inventario de Líderes 5", archivo: "INV_LIDERES5.pdf", descripcion: "Reporte detallado de líderes - parte 5." },
    // Autos
    { titulo: "Inventario de Autos 1", archivo: "INVENTARIOS_AUTOS_1.pdf", descripcion: "Inventario de autos disponibles - parte 1." },
    { titulo: "Inventario de Autos 2", archivo: "INVENTARIOS_AUTOS_2.pdf", descripcion: "Inventario de autos disponibles - parte 2." },
    { titulo: "Inventario de Autos 3", archivo: "INVENTARIOS_AUTOS_3.pdf", descripcion: "Inventario de autos disponibles - parte 3." },
    { titulo: "Inventario de Autos 4", archivo: "INVENTARIOS_AUTOS_4.pdf", descripcion: "Inventario de autos disponibles - parte 4." },
    ];
    
return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
        <header className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 border-b-4 border-indigo-500 pb-3 inline-block tracking-tight">
                📊 Dashboard de Documentos Clave
            </h1>
            <p className="text-lg text-gray-600 mt-4">
                Accede, visualiza y descarga tus informes de gestión importantes.
            </p>
        </header>

        {/* Grid de reportes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {reportes.map((reporte, index) => (
            <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-2xl hover:shadow-indigo-300/50 transition duration-500 ease-in-out border border-gray-100 transform hover:-translate-y-1"
            >
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">
                {reporte.titulo}
            </h2>
            <p className="text-base text-gray-500 mb-5 border-b pb-4">
                {reporte.descripcion}
            </p>

            {/* Vista previa del PDF */}
            <div className="w-full h-96 mb-6 border-4 border-gray-200 rounded-xl overflow-hidden shadow-inner">
                <iframe
                src={`/pdf/${reporte.archivo}`}
                title={`Visualización de ${reporte.titulo}`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                loading="lazy"
                >
                Tu navegador no puede mostrar este PDF.
                </iframe>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-between">
                {/* Botón Ver completo */}
                <a
                href={`/pdf/${reporte.archivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-5 py-3 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/40 transition-transform transform hover:scale-[1.02]"
                >
                    Ver completo
                </a>

                {/* Botón Descargar */}
                <a
                href={`/pdf/${reporte.archivo}`}
                download={reporte.archivo}
                className="flex-1 inline-flex items-center justify-center px-5 py-3 text-lg font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500/40 transition-transform transform hover:scale-[1.02]"
                >
                    Descargar
                </a>
            </div>
            </div>
        ))}
        </div>
    </div>
    );
};

export default Reportes;
