import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Circle, AlertCircle, LifeBuoy } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { toast } from 'sonner';

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

// ----------------------------------------

// Componente CustomSelect (Modificado para usar ID y Name)
const CustomSelect = ({ label, valueId, valueLabel, onChange, options, required = false, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.id === valueId)?.name || valueLabel || 'Seleccionar...';

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
                    <span className={valueId ? 'text-gray-900' : 'text-gray-400'}>
                        {selectedLabel}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
                        {options.map((option) => (
                            <div
                                key={option.id}
                                onClick={() => {
                                    onChange(option.id, option.name); // Pasa el ID y el Nombre
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

// Componente TextArea (Sin cambios)
const TextArea = ({ label, name, value, onChange }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">
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

const Step3TireInspection = ({ formData, handleSelectChange, handleChange, catalogs }) => {

    // Función auxiliar para renderizar las tarjetas de las llantas principales
    const MainTireCard = ({ name, label, position }) => {
        const positionColors = {
            'front-left': 'from-blue-500 to-cyan-500',
            'front-right': 'from-purple-500 to-pink-500',
            'rear-left': 'from-green-500 to-teal-500',
            'rear-right': 'from-orange-500 to-red-500'
        };

        const idKey = `${name}_desgaste_id`;
        const labelKey = `${name}_desgaste_label`;

        return (
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-gradient-to-br ${positionColors[position]} rounded-lg shadow-md`}>
                        <Circle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-800">{label}</h4>
                </div>

                <CustomSelect
                    label="Desgaste"
                    valueId={formData[idKey]}
                    valueLabel={formData[labelKey]}
                    onChange={(id, label) => handleSelectChange(idKey, labelKey, id, label)}
                    options={catalogs.wearOptions}
                    required
                    icon={AlertCircle}
                />
            </div>
        );
    };

    const mainTires = [
        { name: 'delantera_izquierda', label: 'Delantera Izquierda', position: 'front-left' },
        { name: 'delantera_derecha', label: 'Delantera Derecha', position: 'front-right' },
        { name: 'trasera_izquierda', label: 'Trasera Izquierda', position: 'rear-left' },
        { name: 'trasera_derecha', label: 'Trasera Derecha', position: 'rear-right' },
    ];

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                Inspección de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Llantas</span> 🚗
            </h2>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                        <Circle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Llantas Principales</h3>
                </div>

                {/* Diagrama de posición de llantas para mejor UX */}
                <p className="text-sm text-gray-500 mb-4 italic">Clave de posición: Delantera Izquierda (DI), Delantera Derecha (DD), Trasera Izquierda (TI), Trasera Derecha (TD)</p>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {mainTires.map(tire => (
                        <MainTireCard
                            key={tire.name}
                            name={tire.name}
                            label={tire.label}
                            position={tire.position}
                        />
                    ))}
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <LifeBuoy className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        Llanta de Refacción
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CustomSelect
                        label="Estado"
                        valueId={formData.refaccion_estado_id}
                        valueLabel={formData.refaccion_estado_label}
                        onChange={(id, label) => handleSelectChange('refaccion_estado_id', 'refaccion_estado_label', id, label)}
                        options={catalogs.statusOptions}
                        required
                    />

                    <CustomSelect
                        label="Presión"
                        valueId={formData.refaccion_presion_id}
                        valueLabel={formData.refaccion_presion_label}
                        onChange={(id, label) => handleSelectChange('refaccion_presion_id', 'refaccion_presion_label', id, label)}
                        options={catalogs.pressureOptions}
                        required
                    />
                </div>

                <TextArea
                    label="Notas (Máx. 500 caracteres)"
                    name="nota_llantas"
                    value={formData.nota_llantas}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

const Paso3 = ({ informacionId, onNext, onPrevious, currentStep = 3, datosAnteriores = {} }) => {
    const totalSteps = 6;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    // Estados para almacenar los catálogos del backend
    const [catalogs, setCatalogs] = useState({
        wearOptions: [],
        statusOptions: [],
        pressureOptions: []
    });

    // Estado local de los datos (guarda ID y Label para el DTO y la UI)
    const [formData, setFormData] = useState({
        // Llantas principales
        delantera_izquierda_desgaste_id: '',
        delantera_izquierda_desgaste_label: '',
        delantera_derecha_desgaste_id: '',
        delantera_derecha_desgaste_label: '',
        trasera_izquierda_desgaste_id: '',
        trasera_izquierda_desgaste_label: '',
        trasera_derecha_desgaste_id: '',
        trasera_derecha_desgaste_label: '',

        // Refacción
        refaccion_estado_id: '',
        refaccion_estado_label: '',
        refaccion_presion_id: '',
        refaccion_presion_label: '',

        // Notas
        nota_llantas: '',
    });

    useEffect(() => {
        const loadCatalogsFromAPI = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // ⭐ 1. Carga de Desgaste (LLANTAS) - Mapea a DESGASTE_LLANTA en C#
                const wearData = await base44.entities.SistemaEntrega.obtenerEstados('LLANTAS');

                // ⭐ 2. Carga de Estado (REFACCION) - Mapea a ESTADO_COMPONENTE en C#
                // NOTA: Asumo que el estado de la refacción usa ESTADO_COMPONENTE (Presente, Faltante, etc.)
                const statusData = await base44.entities.SistemaEntrega.obtenerEstados('EQUIPO');

                // ⭐ 3. Carga de Presión (REFACCION) - Mapea a PRESION_LLANTA en C#
                const pressureData = await base44.entities.SistemaEntrega.obtenerEstados('PRESION_LLANTA');

                // Mapeo (Sólo transformación, NO filtrado)
                const mapOptions = (data) => data.map(e => ({
                    id: e.estadoId,
                    name: e.nombreEstado
                }));

                const wearOptions = mapOptions(wearData);
                const statusOptions = mapOptions(statusData);
                const pressureOptions = mapOptions(pressureData);

                // ⭐ DEBUG: Comprueba que los arrays no estén vacíos

                setCatalogs({
                    wearOptions,
                    statusOptions,
                    pressureOptions
                });

            } catch (err) {
                console.error('Error al cargar catálogos para Paso 3:', err);
                setError('No se pudieron cargar los catálogos de llantas. Intente recargar.');
                toast.error('Error de API', { description: 'No se cargaron los catálogos de inspección de llantas.' });
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalogsFromAPI();
    }, []);

    // 2. Manejo de cambios de texto
    const handleChange = useCallback((e) => {
        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    }, []);

    // 3. Manejo de cambios de CustomSelect (guarda ID y Label)
    const handleSelectChange = (idName, labelName, idValue, labelValue) => {
        setFormData(prevData => ({
            ...prevData,
            [idName]: idValue,
            [labelName]: labelValue
        }));
    };

    // 4. Mapeo a DTO de C#
    const mapToDto = (data) => {
        // Mapeo directo a los nombres de propiedades del C# LlantumDto
        return {
            // Usamos un ID fijo, en un caso real vendría de un contexto superior
            InformacionId: informacionId, // ESTO DEBE VENIR DE LAS PROPS
            DesgasteDiId: data.delantera_izquierda_desgaste_id || null,
            DesgasteDdId: data.delantera_derecha_desgaste_id || null,
            DesgasteTiId: data.trasera_izquierda_desgaste_id || null,
            DesgasteTdId: data.trasera_derecha_desgaste_id || null,

            // Refacción (IDs)
            EstadoRefaccionId: data.refaccion_estado_id || null,
            PresionRefaccionId: data.refaccion_presion_id || null,

            // Notas
            NotaLlantas: data.nota_llantas || null,
        };
    };


    const handleNext = async () => {
        const requiredFields = [
            'delantera_izquierda_desgaste_id', 'delantera_derecha_desgaste_id',
            'trasera_izquierda_desgaste_id', 'trasera_derecha_desgaste_id',
            'refaccion_estado_id', 'refaccion_presion_id'
        ];

        const hasEmptyFields = requiredFields.some(field => !formData[field]);

        if (hasEmptyFields) {
            alert('Por favor completa todos los campos de selección de llantas y refacción.');
            return;
        }

        const llantumDto = mapToDto(formData);

        try {
            // LLAMADA REAL A LA API USANDO base44.entities.SistemaEntrega.actualizarLlantas
            await base44.entities.SistemaEntrega.actualizarLlantas(informacionId, llantumDto);

            // Éxito
            toast.success('Revisión de componentes de rodaje completada');
            if (onNext) {
                onNext(formData);
            }
        } catch (error) {
            // Manejo de error de la API
            alert(`Error al guardar la inspección de llantas: ${error.message}`);
        }
    };

    useEffect(() => {
        if (datosAnteriores && Object.keys(datosAnteriores).length > 0) {


            setFormData(prevData => {
                const updatedData = { ...prevData };
                for (const key in datosAnteriores) {
                    if (key in updatedData) {
                        updatedData[key] = datosAnteriores[key];
                    }
                }
                return updatedData;
            });
        }
    }, [datosAnteriores]);

    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious();
        }
    };

    return (
        <div className="min-h-screen from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="flex flex-col items-center max-w-6xl mx-auto">
                {/* Título y Steps Indicator (Sin cambios) */}
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
                    <Step3TireInspection
                        formData={formData}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        catalogs={catalogs} // Pasamos los catálogos
                    />
                </div>

                {/* Botones de Navegación (Sin cambios) */}
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

export default Paso3;