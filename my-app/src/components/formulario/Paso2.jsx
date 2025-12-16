import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Car, Lightbulb, Shield, Eye, Loader2 } from 'lucide-react';
import { base44 } from '../../api/base44Client'; // Importar el cliente de API
import { toast } from 'sonner';

// --- Helper Functions and Components (Ajustados para usar ID/Name) ---

// Componente CustomSelect (AJUSTADO para usar IDs)
const CustomSelect = ({ label, value, onChange, options, required = false, icon: Icon, fieldName }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Buscar el nombre que corresponde al valor (ID) actual
    const selectedOption = options.find(opt => opt.id === value);
    const displayValue = selectedOption ? selectedOption.name : '';

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-left flex items-center justify-between hover:border-gray-300"
                >
                    <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
                        {displayValue || 'Seleccionar...'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => {
                                    onChange(fieldName, option.id); // Guardamos el ID
                                    setIsOpen(false);
                                }}
                                className="p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 first:rounded-t-xl last:rounded-b-xl"
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StepIndicator = ({ stepNumber, title, isActive, isComplete }) => {
    return (
        <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${isActive
                ? 'text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 scale-110'
                : isComplete
                    ? 'text-white bg-gradient-to-br from-green-500 to-green-600'
                    : 'text-gray-400 bg-gray-100 border-2 border-gray-200'
                }`}>
                {isComplete ? '✓' : stepNumber}
            </div>
            <span className={`mt-2 text-xs text-center font-medium transition-colors ${isActive ? 'text-blue-600' : isComplete ? 'text-green-600' : 'text-gray-400'
                }`}>
                {title}
            </span>
        </div>
    );
};


// Componente TextArea (sin cambios, solo para referencia)
const TextArea = ({ label, name, value, onChange, icon: Icon }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {label}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="3"
            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
            placeholder={`Agregar ${label.toLowerCase()}...`}
        />
    </div>
);

// --- Componente de Inspección Exterior ---

const Step2ExteriorInspection = ({ formData, handleChange, handleSelectChange, catalogs }) => {
    return (
        <>
            {/* Sección: Carrocería y Cristales */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-100 shadow-lg">
                {/* ... Título ... */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Car className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Carrocería y Cristales
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomSelect
                        label="Carrocería (Condición)"
                        fieldName="CarroceriaCondicionId" // Mapeado al DTO
                        value={formData.CarroceriaCondicionId}
                        onChange={handleSelectChange}
                        options={catalogs.carroceria}
                        icon={Shield}
                    />

                    <CustomSelect
                        label="Parabrisas (Condición)"
                        fieldName="ParabrisasCondicionId" // Mapeado al DTO
                        value={formData.ParabrisasCondicionId}
                        onChange={handleSelectChange}
                        options={catalogs.parabrisas} // Usaremos el mismo catálogo
                        icon={Eye}
                    />

                    <TextArea
                        label="Notas de Carrocería (Máx. 500)"
                        name="CarroceriaNotas" // Mapeado al DTO
                        value={formData.CarroceriaNotas}
                        onChange={handleChange}
                    />

                    <CustomSelect
                        label="Ventanas (Condición)"
                        fieldName="VentanaCondicionId" // Mapeado al DTO
                        value={formData.VentanaCondicionId}
                        onChange={handleSelectChange}
                        options={catalogs.ventanas} // Usaremos el mismo catálogo
                        icon={Eye}
                    />

                    <div className="md:col-span-2">
                        <TextArea
                            label="Notas de Ventanas (Máx. 500)"
                            name="VentanaNotas" // Mapeado al DTO
                            value={formData.VentanaNotas}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Sección: Sistema de Luces */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 shadow-lg">
                {/* ... Título ... */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Sistema de Luces
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomSelect
                        label="Luces Delanteras"
                        fieldName="LuzDelanteraEstadoId" // Mapeado al DTO
                        value={formData.LuzDelanteraEstadoId}
                        onChange={handleSelectChange}
                        options={catalogs.luces}
                        required
                    />
                    <CustomSelect
                        label="Luces Traseras"
                        fieldName="LuzTraseraEstadoId" // Mapeado al DTO
                        value={formData.LuzTraseraEstadoId}
                        onChange={handleSelectChange}
                        options={catalogs.luces}
                        required
                    />
                    <CustomSelect
                        label="Direccionales"
                        fieldName="DireccionalesEstadoId" // Mapeado al DTO
                        value={formData.DireccionalesEstadoId}
                        onChange={handleSelectChange}
                        options={catalogs.luces}
                        required
                    />
                    <CustomSelect
                        label="Luces de Freno"
                        fieldName="LuzFrenoEstadoId" // Mapeado al DTO
                        value={formData.LuzFrenoEstadoId}
                        onChange={handleSelectChange}
                        options={catalogs.luces}
                        required
                    />
                </div>
            </div>
        </>
    );
};


const Paso2 = ({ informacionId, onNext, onPrevious, currentStep = 2, datosAnteriores = {} }) => {
    const totalSteps = 6;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const previousData = datosAnteriores?.inspeccionExterior || {};
    const [isSaved, setIsSaved] = useState(false);

    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    // Estado para guardar los catálogos cargados
    const [catalogs, setCatalogs] = useState({
        carroceria: [],
        parabrisas: [],
        ventanas: [],
        luces: []
    });


    // Estado del formulario alineado con ExteriorDto (usando camelCase para JS)
    const [formData, setFormData] = useState({
        // AHORA USAMOS 'previousData' PARA INICIALIZAR:
        CarroceriaCondicionId: previousData.CarroceriaCondicionId || '',
        CarroceriaNotas: previousData.CarroceriaNotas || '',
        ParabrisasCondicionId: previousData.ParabrisasCondicionId || '',
        VentanaCondicionId: previousData.VentanaCondicionId || '',
        VentanaNotas: previousData.VentanaNotas || '',
        LuzDelanteraEstadoId: previousData.LuzDelanteraEstadoId || '',
        LuzTraseraEstadoId: previousData.LuzTraseraEstadoId || '',
        DireccionalesEstadoId: previousData.DireccionalesEstadoId || '',
        LuzFrenoEstadoId: previousData.LuzFrenoEstadoId || '',
    });

    // 1. Carga de Catálogos (Simulación/Asunción de Endpoints)
    // Dentro de Paso2...
    useEffect(() => {
        const loadCatalogsFromAPI = async () => {
            setIsLoading(true);
            try {
                // ⭐ 1. Respuesta cruda de la API
                // Se asume que 'CARROCERIA' busca 'CONDICION_GENERAL' o 'CONDICION_SIMPLE'
                // Si 'CARROCERIA' funciona, mantenlo así.
                const allEstadosCarroceria = await base44.entities.SistemaEntrega.obtenerEstados('CARROCERIA');

                // ⭐ CORRECCIÓN CLAVE AQUÍ: Usar 'ESTADO_LUCES'
                const allEstadosLuces = await base44.entities.SistemaEntrega.obtenerEstados('ESTADO_LUCES');

                const condicionGeneral = allEstadosCarroceria
                    .map(e => ({ id: e.estadoId, name: e.nombreEstado }));

                const estadoLuces = allEstadosLuces
                    .map(e => ({ id: e.estadoId, name: e.nombreEstado }));

                setCatalogs({
                    carroceria: condicionGeneral,
                    parabrisas: condicionGeneral,
                    ventanas: condicionGeneral,
                    luces: estadoLuces,
                });

            } catch (err) {
                console.error('3. ERROR en Carga de Catálogos:', err);
                setError('No se pudieron cargar los catálogos de estados desde la API. Intente recargar.');
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalogsFromAPI();
    }, []);

    const handleChange = useCallback((e) => {
        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
        setIsSaved(false);
    }, [setIsSaved]);

    const handleSelectChange = (name, value) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setIsSaved(false);
    };

    const handleNext = async () => {
        if (isSaved) {
            if (onNext) {
                // Navegamos con los datos del estado actual
                onNext({ inspeccionExterior: { InformacionId: informacionId, ...formData } });
            }
            return; // Detenemos la función aquí
        }

        // Validación de campos requeridos (solo los ID)
        if (!formData.CarroceriaCondicionId || !formData.ParabrisasCondicionId ||
            !formData.VentanaCondicionId || !formData.LuzDelanteraEstadoId ||
            !formData.LuzTraseraEstadoId || !formData.DireccionalesEstadoId || !formData.LuzFrenoEstadoId) {
            alert('Por favor selecciona una condición/estado para todos los campos principales.');
            return;
        }

        if (!informacionId) {
            setError("Error: No se encontró el ID de la inspección. Vuelve al Paso 1.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // 3. Mapear datos locales a ExteriorDto (Añadir InformacionId)
        const ExteriorDto = {
            InformacionId: informacionId, // Clave obligatoria
            ...formData,
        };

        try {
            // Llamar al endpoint de actualización específico para el exterior
            await base44.entities.SistemaEntrega.actualizarExterior(informacionId, ExteriorDto);

            // ⚡ Aquí mostramos la alerta, solo en la primera ejecución exitosa
            toast.success('Datos del exterior guardados correctamente');

            // ⚡ MARCANDO COMO GUARDADO
            setIsSaved(true);

            if (onNext) {
                onNext({ inspeccionExterior: ExteriorDto });
            }
        } catch (err) {
            setError(err.message || 'Ocurrió un error al guardar la inspección exterior.');
            console.error('API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious();
        }
    };

    return (
        <div className="min-h-screen from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="flex flex-col items-center max-w-6xl mx-auto">
                {/* ... Steps Indicator ... */}
                {/* ... Títulos ... */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-3">
                        Sistema de Entrega de Vehículos
                    </h1>
                    <p className="text-gray-600 text-lg">Formulario de inspección completa</p>
                </div>

                <div className="w-full max-w-5xl mx-auto mb-12">
                    <div className="flex justify-between items-start overflow-x-auto whitespace-nowrap py-2">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.number}>
                                <div className="flex-shrink-0 mr-4">
                                    <StepIndicator
                                        stepNumber={step.number}
                                        title={step.title}
                                        isActive={step.number === currentStep}
                                        isComplete={step.number < currentStep}
                                    />
                                </div>
                                {index < totalSteps - 1 && (
                                    <div className={`flex-1 mt-5 h-1 mx-2 rounded-full transition-all duration-300 ${step.number < currentStep ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-5xl bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                        Inspección <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exterior</span>
                    </h2>

                    {/* Mostrar Error */}
                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <Step2ExteriorInspection
                        formData={formData}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        catalogs={catalogs}
                    />
                </div>

                <div className="w-full max-w-5xl flex justify-between mt-10">
                    <button
                        onClick={handlePrevious}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold transition-all duration-200
                         hover:bg-gray-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Anterior</span>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-200
                         hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <>
                                <span>Siguiente</span>
                                <span>→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Paso2;