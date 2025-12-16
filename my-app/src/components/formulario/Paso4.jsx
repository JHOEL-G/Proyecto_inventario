import React, { useState, useCallback, useEffect } from 'react'; // <-- ¡Añadir useEffect!
import { ChevronDown, Droplet, Sofa, Gauge, Wind, Radio, Sparkles, Waves } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { toast } from 'sonner';

// =================================================================
// COMPONENTES REUTILIZABLES ADAPTADOS
// =================================================================

// CustomSelect ADAPTADO: Ahora trabaja con IDs de catálogo
const CustomSelect = ({ label, valueId, valueLabel, onChange, options, required = false, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Muestra el label asociado al ID o un placeholder
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
                                    onChange(option.id, option.name); // Retorna ID y Label
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

// =================================================================
// COMPONENTE STEP 4: Lógica de Formulario
// =================================================================

const Step4FluidsInterior = ({ formData, handleChange, handleSelectChange, catalogs }) => {

    const handleSelect = (name, valueId, valueLabel) => {
        handleSelectChange(`${name}_id`, `${name}_label`, valueId, valueLabel);
    }

    const fluids = [
        { name: 'aceite_motor', dtoName: 'AceiteMotor', label: 'Aceite de Motor', icon: Droplet, color: 'from-amber-500 to-orange-500' },
        { name: 'refrigerante', dtoName: 'Refrigerante', label: 'Refrigerante', icon: Waves, color: 'from-cyan-500 to-blue-500' },
        { name: 'liquido_frenos', dtoName: 'LiquidoFrenos', label: 'Líquido de Frenos', icon: Droplet, color: 'from-red-500 to-rose-500' },
        { name: 'liquido_limpiaparabrisas', dtoName: 'LiquidoLimpiaparabrisas', label: 'Líquido Limpiaparabrisas', icon: Droplet, color: 'from-sky-500 to-blue-500' },
    ];

    return (
        <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                Niveles de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fluidos</span> y Condición <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Interior</span> 💧🛋️
            </h2>

            {/* Sección: Niveles de Fluidos */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Droplet className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Niveles de Fluidos
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {fluids.map((fluid) => (
                        <div key={fluid.name} className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${fluid.color} flex items-center justify-center mb-3 shadow-md`}>
                                <fluid.icon className="w-5 h-5 text-white" />
                            </div>
                            <CustomSelect
                                label={fluid.label}
                                valueId={formData[`${fluid.name}_id`]}
                                valueLabel={formData[`${fluid.name}_label`]}
                                onChange={(id, label) => handleSelect(fluid.name, id, label)}
                                options={catalogs.fluidOptions}
                                required
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección: Condición Interior */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white rounded-xl shadow-md">
                        <Sofa className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Condición Interior
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <CustomSelect
                        label="Asientos"
                        valueId={formData.asientos_id}
                        valueLabel={formData.asientos_label}
                        onChange={(id, label) => handleSelect('asientos', id, label)}
                        options={catalogs.conditionOptions}
                        required
                        icon={Sofa}
                    />
                    <CustomSelect
                        label="Tablero e Instrumentos"
                        valueId={formData.tablero_componentes_id}
                        valueLabel={formData.tablero_componentes_label}
                        onChange={(id, label) => handleSelect('tablero_componentes', id, label)} // Renombrado a 'tablero_componentes'
                        options={catalogs.allFunctionalOptions}
                        required
                        icon={Gauge}
                    />
                </div>

                <div className="mb-6">
                    <CustomSelect
                        label="Cinturones de Seguridad"
                        valueId={formData.cinturones_seguridad_id}
                        valueLabel={formData.cinturones_seguridad_label}
                        onChange={(id, label) => handleSelect('cinturones_seguridad', id, label)}
                        options={catalogs.allFunctionalOptions}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <CustomSelect
                        label="Aire Acondicionado"
                        valueId={formData.aire_acondicionado_id}
                        valueLabel={formData.aire_acondicionado_label}
                        onChange={(id, label) => handleSelect('aire_acondicionado', id, label)}
                        options={catalogs.functionalOptions}
                        required
                        icon={Wind}
                    />
                    <CustomSelect
                        label="Radio/Estéreo"
                        valueId={formData.radio_esterio_id}
                        valueLabel={formData.radio_esterio_label}
                        onChange={(id, label) => handleSelect('radio_esterio', id, label)} // Renombrado a 'radio_esterio'
                        options={catalogs.functionalOptions}
                        required
                        icon={Radio}
                    />
                    <CustomSelect
                        label="Limpieza General"
                        valueId={formData.limpieza_general_id}
                        valueLabel={formData.limpieza_general_label}
                        onChange={(id, label) => handleSelect('limpieza_general', id, label)}
                        options={catalogs.cleanlinessOptions}
                        required
                        icon={Sparkles}
                    />
                    <CustomSelect
                        label="Olores"
                        valueId={formData.olores_id}
                        valueLabel={formData.olores_label}
                        onChange={(id, label) => handleSelect('olores', id, label)}
                        options={catalogs.odorOptions}
                        required
                        icon={Waves}
                    />
                </div>

                <TextArea
                    label="Notas"
                    name="notas_interiores" // Corregido a 'notas_interiores' para coincidir con NotasInteriores
                    value={formData.notas_interiores}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};


// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

const Paso4 = ({ informacionId, onNext, onPrevious, currentStep = 4, datosAnteriores = {} }) => {
    const totalSteps = 6;
    // Estado inicializado correctamente con arrays vacíos para evitar fallos de renderizado.
    const [catalogs, setCatalogs] = useState({ fluidOptions: [], conditionOptions: [], allFunctionalOptions: [], functionalOptions: [], cleanlinessOptions: [], odorOptions: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // Nuevo estado para el botón de "Siguiente"

    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    // Estado local adaptado para IDs (Mantenido igual)
    const [formData, setFormData] = useState({
        // Fluidos
        aceite_motor_id: null, aceite_motor_label: '',
        refrigerante_id: null, refrigerante_label: '',
        liquido_frenos_id: null, liquido_frenos_label: '',
        liquido_limpiaparabrisas_id: null, liquido_limpiaparabrisas_label: '',

        // Interiores
        asientos_id: null, asientos_label: '',
        tablero_componentes_id: null, tablero_componentes_label: '',
        cinturones_seguridad_id: null, cinturones_seguridad_label: '',
        aire_acondicionado_id: null, aire_acondicionado_label: '',
        radio_esterio_id: null, radio_esterio_label: '',
        limpieza_general_id: null, limpieza_general_label: '',
        olores_id: null, olores_label: '',

        // Notas
        notas_interiores: '',
    });

    // #region Carga de Catálogos y Datos Anteriores
    useEffect(() => {
        const loadCatalogsFromAPI = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Lógica de carga de catálogos desde la API...
                const fluidData = await base44.entities.SistemaEntrega.obtenerEstados('ESTADO_FLUIDOS');
                const conditionData = await base44.entities.SistemaEntrega.obtenerEstados('CONDICION_SIMPLE');
                const allFunctionalData = await base44.entities.SistemaEntrega.obtenerEstados('FUNCIONALIDAD_GLOBAL');
                const functionalData = await base44.entities.SistemaEntrega.obtenerEstados('FUNCIONALIDAD');
                const cleanlinessData = await base44.entities.SistemaEntrega.obtenerEstados('LIMPIEZA');
                const odorData = await base44.entities.SistemaEntrega.obtenerEstados('OLORES');

                const mapOptions = (data) => data.map(e => ({ id: e.estadoId, name: e.nombreEstado }));

                setCatalogs({
                    fluidOptions: mapOptions(fluidData),
                    conditionOptions: mapOptions(conditionData),
                    allFunctionalOptions: mapOptions(allFunctionalData),
                    functionalOptions: mapOptions(functionalData),
                    cleanlinessOptions: mapOptions(cleanlinessData),
                    odorOptions: mapOptions(odorData),
                });

            } catch (err) {
                console.error('ERROR al cargar catálogos del Paso 4:', err);
                setError('No se pudieron cargar los catálogos del interior/fluidos. Intente recargar.');
                toast.error('Error al cargar datos necesarios.');
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalogsFromAPI();
    }, []);

    useEffect(() => {
        // Lógica para pre-cargar datos anteriores (Mantenido igual)
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
    // #endregion

    // #region Manejadores de estado y DTO
    const handleChange = useCallback((e) => {
        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    }, []);

    const handleSelectChange = (idName, labelName, idValue, labelValue) => {
        setFormData(prevData => ({
            ...prevData,
            [idName]: idValue,
            [labelName]: labelValue
        }));
    };

    const mapToDto = (data) => {
        // Lógica de mapeo a DTO (Mantenido igual)
        const getId = (id) => id > 0 ? id : null;

        return {
            InformacionId: informacionId,
            AceiteMotorId: getId(data.aceite_motor_id),
            RefrigeranteId: getId(data.refrigerante_id),
            LiquidoFrenosId: getId(data.liquido_frenos_id),
            LiquidoLimpiaparabrisasId: getId(data.liquido_limpiaparabrisas_id),
            AsientosId: getId(data.asientos_id),
            TableroComponentesId: getId(data.tablero_componentes_id),
            CinturonesSeguridadId: getId(data.cinturones_seguridad_id),
            AireAcondicionadoId: getId(data.aire_acondicionado_id),
            RadioEsterioId: getId(data.radio_esterio_id),
            LimpiezaGeneralId: getId(data.limpieza_general_id),
            OloresId: getId(data.olores_id),
            NotasInteriores: data.notas_interiores || null,
        };
    };
    // #endregion

    // #region Navegación y Guardado
    const handleNext = async () => {
        const requiredFields = [
            'aceite_motor_id', 'refrigerante_id', 'liquido_frenos_id', 'liquido_limpiaparabrisas_id',
            'asientos_id', 'tablero_componentes_id', 'cinturones_seguridad_id',
            'aire_acondicionado_id', 'radio_esterio_id', 'limpieza_general_id', 'olores_id'
        ];

        const hasEmptyFields = requiredFields.some(field => !formData[field]);

        if (hasEmptyFields) {
            toast.warning('Por favor completa todos los campos requeridos (*).');
            return;
        }

        setIsSaving(true);
        const fluidosInteriorDto = mapToDto(formData);

        try {
            await base44.entities.SistemaEntrega.actualizarFluidosInterior(informacionId, fluidosInteriorDto);

            toast.success('Información interna del vehículo guardada correctamente');

            if (onNext) {
                onNext(formData);
            }
        } catch (error) {
            console.error("Error al guardar Paso 4:", error);
            toast.error(`Error al guardar la inspección de Fluidos/Interior.`);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious();
        }
    };
    // #endregion

    // #region Renderizado con manejo de Carga/Error
    return (
        <div className="min-h-screen from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="flex flex-col items-center max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-3">
                        Sistema de Entrega de Vehículos
                    </h1>
                    <p className="text-gray-600 text-lg">Formulario de inspección completa</p>
                </div>

                {/* Indicador de Pasos */}
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

                {/* Contenido del Paso 4 */}
                <div className="w-full max-w-5xl bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-100">
                    <Step4FluidsInterior
                        formData={formData}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                        catalogs={catalogs}
                    />
                </div>

                {/* Botones de Navegación */}
                <div className="w-full max-w-5xl flex justify-between mt-10">
                    <button
                        onClick={handlePrevious}
                        className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold transition-all duration-200
                             hover:bg-gray-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                        disabled={isSaving} // Desactivar si se está guardando
                    >
                        <span>←</span>
                        <span>Anterior</span>
                    </button>

                    <button
                        onClick={handleNext}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-200
                             hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving} // Desactivar durante el guardado
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Guardando...</span>
                            </>
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

export default Paso4;