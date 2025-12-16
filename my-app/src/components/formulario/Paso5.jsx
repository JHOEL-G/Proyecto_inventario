import React, { useState, useCallback, useEffect } from 'react'; // <-- Asegúrate de tener useEffect aquí
import { Wrench, FileText, Camera, MessageSquare, Shield, BookOpen, CreditCard, Ambulance } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { toast } from 'sonner';

// =================================================================
// COMPONENTES REUTILIZABLES
// Se omiten por ser iguales, pero se usan los nombres de campos actualizados
// =================================================================

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

const ModernCheckbox = ({ label, name, checked, onChange, icon: Icon }) => {
    return (
        <label className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-blue-300 hover:shadow-md group">
            <input
                type="checkbox"
                name={name}
                checked={checked || false}
                onChange={onChange}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <div className="ml-3 flex items-center gap-2 flex-1">
                {Icon && <Icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />}
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {label}
                </span>
            </div>
        </label>
    );
};

const TextArea = ({ label, name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            {label}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="4"
            maxLength={1000} // Aplicando la restricción del DTO
            className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 resize-none"
            placeholder="Ingrese cualquier observación adicional sobre el estado del vehículo (máx. 1000 caracteres)..."
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
            {value ? value.length : 0} / 1000
        </p>
    </div>
);


// =================================================================
// COMPONENTE ESPECÍFICO DEL PASO 5 (ADAPTADO A NOMBRES DE DTO)
// =================================================================

const Step5EquipmentDocumentation = ({ formData, handleChange, handleFileChange }) => {

    // NOMBRES DE CAMPOS EN PASCALCASE PARA COINCIDIR CON DTO
    const tools = [
        { name: 'GatoHidraulico', label: 'Gato Hidráulico', icon: Wrench },
        { name: 'LlaveCruceta', label: 'Llave de Cruceta', icon: Wrench },
        { name: 'KitHerramientas', label: 'Kit de Herramientas', icon: Wrench },
        { name: 'TriangulosSeguridad', label: 'Triángulos de Seguridad', icon: Shield },
        { name: 'Extinguidor', label: 'Extinguidor', icon: Shield },
        { name: 'BotiquinPrimerosAuxilios', label: 'Botiquín de Primeros Auxilios', icon: Ambulance },
    ];

    // NOMBRES DE CAMPOS EN PASCALCASE PARA COINCIDIR CON DTO
    const documents = [
        { name: 'ManualPropietario', label: 'Manual del Propietario', icon: BookOpen },
        { name: 'TarjetaCirculacion', label: 'Tarjeta de Circulación', icon: CreditCard },
        { name: 'PolizaSeguro', label: 'Póliza de Seguro', icon: FileText },
    ];

    const fileNames = formData.fotos_archivos.length > 0
        ? `${formData.fotos_archivos.length} archivo(s) seleccionado(s)`
        : 'Sin archivos seleccionados';

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                Equipo de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Seguridad</span> y <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Documentación</span>
            </h2>

            {/* Sección 1: Herramientas y Equipo de Emergencia */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Wrench className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Herramientas y Equipo de Emergencia
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map(tool => (
                        <ModernCheckbox
                            key={tool.name}
                            label={tool.label}
                            name={tool.name}
                            checked={formData[tool.name]}
                            onChange={handleChange}
                            icon={tool.icon}
                        />
                    ))}
                </div>
            </div>

            {/* Sección 2: Documentación del Vehículo */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Documentación del Vehículo
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {documents.map(doc => (
                        <ModernCheckbox
                            key={doc.name}
                            label={doc.label}
                            name={doc.name}
                            checked={formData[doc.name]}
                            onChange={handleChange}
                            icon={doc.icon}
                        />
                    ))}
                </div>
            </div>

            {/* Sección 3: Documentación Fotográfica (Se mantiene, pero sus datos se manejan aparte del DTO principal) */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Documentación Fotográfica
                    </h3>
                </div>

                <p className="text-sm text-green-700 mb-6 ml-1">
                    Capture fotos del vehículo desde diferentes ángulos.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label htmlFor="file-upload" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold cursor-pointer hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        <span>Elegir Archivos</span>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        name="fotos_archivos"
                        onChange={handleFileChange}
                        multiple
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="flex-1 p-3 bg-white rounded-xl border-2 border-gray-200">
                        <span className="text-sm text-gray-600">{fileNames}</span>
                    </div>
                </div>

                <p className="mt-4 text-xs text-green-700 italic ml-1">
                    * Las fotos se almacenarán junto con el formulario al finalizar
                </p>
            </div>

            {/* Sección 4: Observaciones Adicionales */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <MessageSquare className="w-6 h-6 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                        Observaciones Adicionales
                    </h3>
                </div>

                <TextArea
                    label="Comentarios"
                    name="ObservacionesAdicionales" // COINCIDE con el DTO
                    value={formData.ObservacionesAdicionales}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

// =================================================================
// COMPONENTE PRINCIPAL DEL PASO 5 (CON MANEJO DE ESTADO Y DTO)
// =================================================================

const Paso5 = ({ informacionId, onNext, onPrevious, currentStep = 5, datosAnteriores = {} }) => {
    const totalSteps = 6;

    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    // Estado local con nombres de campos en PascalCase para COINCIDIR con el DTO
    const [formData, setFormData] = useState({
        GatoHidraulico: false,
        Extinguidor: false,
        LlaveCruceta: false,
        BotiquinPrimerosAuxilios: false,
        KitHerramientas: false,
        TriangulosSeguridad: false,
        ManualPropietario: false,
        TarjetaCirculacion: false,
        PolizaSeguro: false,

        // Campo del DTO (Observaciones)
        ObservacionesAdicionales: '',

        // Campo NO del DTO, solo del frontend para manejo de archivos
        fotos_archivos: [],
    });

    useEffect(() => {
        if (datosAnteriores && Object.keys(datosAnteriores).length > 0) {
            setFormData(prevData => {
                const updatedData = { ...prevData };
                for (const key in datosAnteriores) {
                    if (key in updatedData) {
                        // Las checkbox son booleanas, el texto es string, los archivos son un array
                        updatedData[key] = datosAnteriores[key];
                    }
                }
                return updatedData;
            });
        }
    }, [datosAnteriores]);

    const handleChange = useCallback((e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setFormData(prevData => ({
            ...prevData,
            fotos_archivos: files
        }));
    }, []);

    /**
     * Función para mapear el estado del formulario al DTO de C# EquipoDto.
     * Esto asegura que los nombres y tipos coincidan antes de enviarlo al backend.
     */
    const mapToDto = (data) => {
        return {
            GatoHidraulico: data.GatoHidraulico,
            Extinguidor: data.Extinguidor,
            LlaveCruceta: data.LlaveCruceta,
            BotiquinPrimerosAuxilios: data.BotiquinPrimerosAuxilios,
            KitHerramientas: data.KitHerramientas,
            TriangulosSeguridad: data.TriangulosSeguridad,
            ManualPropietario: data.ManualPropietario,
            TarjetaCirculacion: data.TarjetaCirculacion,
            PolizaSeguro: data.PolizaSeguro,

            // Si está vacío, enviamos null (el DTO acepta string? = null)
            ObservacionesAdicionales: data.ObservacionesAdicionales || null,
        };
    };

    const handleNext = async () => { // <--- **IMPORTANTE: HACER ASYNC**

        // Se mantiene la validación
        if (formData.ObservacionesAdicionales && formData.ObservacionesAdicionales.length > 1000) {
            alert('Las Observaciones Adicionales no pueden exceder los 1000 caracteres.');
            return;
        }

        // 1. Crear DTO con los datos limpios y mapeados
        const equipoDto = mapToDto(formData);

        // **Añadido: Validación de InformacionId**
        if (!informacionId) {
            alert('Error: No se encontró el ID de la información de la entrega. No se puede guardar el paso.');
            return;
        }

        try {
            // 2. LLAMADA REAL A LA API PARA GUARDAR DATOS DEL EQUIPO Y DOCUMENTACIÓN
            // Usamos el endpoint que asume la actualización del equipo.
            await base44.entities.SistemaEntrega.actualizarEquipo(informacionId, equipoDto);

            // **Nota sobre Archivos:** // La subida de 'formData.fotos_archivos' (si hay archivos) 
            // generalmente requiere un endpoint separado (e.g., /uploadFiles) 
            // y se maneja en el componente padre o un servicio de archivos. 
            // Por ahora, solo confirmamos la subida de los datos del DTO.

            toast.success('Información de equipamiento y documentos guardada correctamente');

            // 3. Comunicar al padre el éxito y pasar el estado de REACT (formData) para rehidratación
            if (onNext) {
                // Pasamos formData (estado de React) y fotos_archivos para que el padre decida cómo subirlos
                onNext(formData, formData.fotos_archivos);
            }
        } catch (error) {
            // Manejo de error de la API
            alert(`Error al guardar la inspección de Equipo y Documentación: ${error.message}`);
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
                    <Step5EquipmentDocumentation
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                    />
                </div>

                <div className="w-full max-w-5xl flex justify-between mt-10">
                    <button
                        onClick={handlePrevious}
                        className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold transition-all duration-200
                             hover:bg-gray-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Anterior</span>
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-200
                             hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                    >
                        <span>Siguiente</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Paso5;