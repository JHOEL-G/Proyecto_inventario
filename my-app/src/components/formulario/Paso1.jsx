import { useState, useEffect, useCallback } from "react";
import React from 'react';
import { ChevronDown, Fuel, Loader2 } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { toast } from "sonner";

// Componente de indicador de paso
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

// Componente CustomSelect (CORREGIDO Y ROBUSTO)
const CustomSelect = ({ label, value, onChange, options, required = false, fieldName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const safeOptions = Array.isArray(options) ? options : [];
    const selectedOption = safeOptions.find(opt => opt.id === value);
    const displayValue = selectedOption ? selectedOption.name : '';

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-gray-300 transition-colors"
                >
                    <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
                        {displayValue || `Seleccionar ${label.toLowerCase()}`}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 rounded-xl shadow-xl max-h-60 overflow-auto">
                        {safeOptions.length === 0 ? (
                            <div className="p-3 text-gray-500 text-center">Cargando opciones...</div>
                        ) : (
                            safeOptions.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => {
                                        onChange(fieldName, option.id);
                                        setIsOpen(false);
                                    }}
                                    className="p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                                >
                                    {option.name}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente FormField (CORREGIDO Y ROBUSTO)
const FormField = ({
    label,
    name,
    value,
    type = 'text',
    required = false,
    onChange,
    min = null,
    readOnly = false
}) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value === undefined || value === null ? '' : value}
            onChange={readOnly ? undefined : onChange}
            min={min}
            readOnly={readOnly}
            className={`w-full p-3 border-2 rounded-xl transition-all duration-200 
                ${readOnly
                    ? 'bg-gray-100 border-gray-200 text-gray-600 cursor-default'
                    : 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                }`}
            required={required && !readOnly}
            placeholder={readOnly ? 'Automático (Base de Datos)' : `Ingrese ${label.toLowerCase()}`}
        />
    </div>
);

// Componente Deslizador de Gasolina
const FuelSlider = ({ percentage, onChange }) => (
    <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Nivel de Gasolina
            </label>
            <span className="text-lg font-bold text-blue-600">{percentage}%</span>
        </div>
        <div className="relative">
            <input
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={onChange}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                }}
            />
            <style>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                    transition: all 0.2s;
                }
                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
                }
                .slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                    transition: all 0.2s;
                }
                .slider::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
                }
            `}</style>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Vacío</span>
            <span>Medio</span>
            <span>Lleno</span>
        </div>
    </div>
);

const Paso1 = ({ onNext, datosAnteriores = {}, currentStep }) => {
    const totalSteps = 6;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [vehiculos, setVehiculos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [colores, setColores] = useState([]);

    const previousData = datosAnteriores?.informacionGeneral || {};

    const getGasolinaValue = (data) => {
        const apiGasolina = data.NivelGasolina ?? data.nivelGasolina;

        if (data.gasolina !== undefined) {
            return data.gasolina;
        }

        if (apiGasolina !== undefined && apiGasolina !== null && typeof apiGasolina === 'number') {
            return Math.round(apiGasolina * 100);
        }

        return 50;
    };

    const [formData, setFormData] = useState({
        vehiculoId: previousData.vehicleCatalogId // 🎯 USAR ESTE NOMBRE DE PROPIEDAD
            || previousData.VehiculoId
            || previousData.vehiculoId
            || previousData.VehicleId
            || previousData.ID
            || previousData.informacionId // ⚠️ Mantener las variaciones si son necesarias
            || '',
        modeloId: previousData.ModeloId || previousData.modeloId || '', // Añade ModeloId
        year: previousData.Año || previousData.year || '',
        placas: previousData.Placas || previousData.placas || '',
        colorId: previousData.ColorId || previousData.colorId || '',
        kilometraje: previousData.Kilometraje || previousData.kilometraje || '',
        gasolina: getGasolinaValue(previousData),
    });

    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    // Paso 1: Reemplaza tu función autoPopulateFields con esta versión
    const autoPopulateFields = useCallback((vehicleId, allVehicles, allColores) => {
        if (vehicleId && allVehicles.length > 0) {
            const selectedVehicle = allVehicles.find(v => v.id === vehicleId);

            if (selectedVehicle && selectedVehicle.data) {
                const vehicleData = selectedVehicle.data;

                let colorIdToUse = ''; // Variable para almacenar el ID final del color
                const allColoresMapped = allColores; // Usamos el nombre 'allColores' de la dependencia.

                // 1. Intentar usar el ID de color que viene del vehículo (propiedad ColorId o color)
                const apiColorId = vehicleData.ColorId || vehicleData.colorId || '';

                // Verificamos si este ID existe en nuestro catálogo de colores
                const isIdInCatalog = allColoresMapped.some(c => c.id === apiColorId);

                if (isIdInCatalog && apiColorId) {
                    // Caso A: El dato ya es un ID y existe en el catálogo. ¡Perfecto!
                    colorIdToUse = apiColorId;

                } else if (typeof vehicleData.color === 'string' && allColoresMapped.length > 0) {
                    // Caso B: El dato es el NOMBRE del color (string). Necesitamos buscar su ID.
                    const colorNameFromApi = vehicleData.color.toLowerCase().trim();
                    const colorMatch = allColoresMapped.find(c =>
                        c.name.toLowerCase().trim() === colorNameFromApi
                    );

                    if (colorMatch) {
                        colorIdToUse = colorMatch.id;
                    } else {
                        console.warn(`3.4. ⚠️ Color "${vehicleData.color}" no coincide con ningún nombre en el catálogo. Se deja vacío.`);
                    }
                } else {
                    // Caso C: No hay información de color válida para precargar.
                }

                // Actualizar el formData con los valores del vehículo encontrado
                setFormData(prev => ({
                    ...prev,
                    marcaId: vehicleData.marcaId || '',
                    modeloId: vehicleData.modeloId || '',
                    year: vehicleData.Año || '',
                    placas: vehicleData.Placas || '',
                    colorId: colorIdToUse, // <-- ¡Este es el valor que debe usarse!
                    kilometraje: vehicleData.mileage ?? '',
                }));

                // Devolvemos true para indicar que se hizo la precarga
                return true;
            } else {
            }
        }
        return false;
    }, []); // Se mantiene la lista de dependencias vacía si estás seguro de que React garantiza la estabilidad de la función, 
    // pero se recomienda incluir `colores` si se usa directamente fuera del closure, aunque aquí se pasa como argumento.
    // CARGA DE CATÁLOGOS AL INICIAR (CORREGIDO PARA API REAL)
    useEffect(() => {
        const loadCatalogs = async () => {
            setIsLoading(true);
            try {
                // Cargar vehículos desde la API
                const vehiclesResponse = await base44.entities.Vehicle.list();

                // Validación y normalización de datos de vehículos
                const mappedVehiculos = Array.isArray(vehiclesResponse)
                    ? vehiclesResponse
                        .map((v, index) => {
                            // Usar la estructura REAL de la API
                            const vehiculoId = v.id; // La API usa 'id'
                            const marcaId = v.marcaID; // La API usa 'marcaID'
                            const modeloId = v.modeloID; // La API usa 'modeloID'
                            const marca = v.marcaNombre || 'Sin Marca';
                            const modelo = v.modeloNombre || 'Sin Modelo';
                            const placas = v.licensePlate || 'Sin Placas';
                            const kilometraje = v.kilometraje || 'Sin Kilometraje';
                            const mileageOriginal = v.mileage || 'Sin Mileage Original';

                            // Si no tiene ID, no lo incluimos
                            if (!vehiculoId) {
                                console.warn('⚠️ Vehículo sin ID encontrado:', v);
                                return null;
                            }

                            return {
                                id: vehiculoId,
                                name: `${marca} ${modelo} (${placas})`,
                                data: {
                                    ...v,
                                    // Normalizar propiedades para uso consistente
                                    vehiculoId: vehiculoId,
                                    marcaId: marcaId,
                                    modeloId: modeloId,
                                    Marca: marca,
                                    Modelo: modelo,
                                    Placas: placas,
                                    Año: v.year,
                                    ColorId: v.color, // Puede ser un string o ID
                                    Kilometraje: v.mileage ?? ''

                                }
                            };
                        })
                        .filter(v => v !== null) // Filtrar los null (vehículos sin ID)
                    : [];


                const [brandsResponse, colorsResponse] = await Promise.all([
                    // 1. Llamada a Marcas (Mantenida)
                    base44.entities.Brand.list(),

                    // 2. LLAMADA DE COLORES (MODIFICADA)
                    // Aquí se llama a la función real de la API en lugar de Promise.resolve(datos_estáticos)
                    base44.entities.Vehicle.getColorOptions(),
                ]);

                const mappedColores = Array.isArray(colorsResponse)
                    ? colorsResponse.map(c => ({
                        id: c.colorId, // Asumo que el ID es 'colorId'
                        name: c.nombreColor || c.colorName // Asumo que el nombre es 'nombreColor' o 'colorName'
                    }))
                    : [];

                setVehiculos(mappedVehiculos);
                setMarcas(Array.isArray(brandsResponse)
                    ? brandsResponse.map(b => ({
                        id: b.marcaId || b.MarcaId,
                        name: b.marca || b.Marca || 'Sin Nombre'
                    }))
                    : []);
                setColores(mappedColores);

                const initialVehiculoId =
                    // 🎯 CORRECCIÓN 1 (repetida para useEffect): Usar la propiedad en camelCase recibida del DTO del backend
                    previousData.vehicleCatalogId
                    || previousData.VehiculoId
                    || previousData.vehiculoId
                    || previousData.VehicleId
                    || previousData.ID
                    || previousData.informacionId
                    || '';
                if (initialVehiculoId) {
                    // Llama la función con el ID inicial y los catálogos recién cargados
                    autoPopulateFields(initialVehiculoId, mappedVehiculos, colorsResponse);
                } else {
                }

            } catch (err) {
                setError(`Error al cargar catálogos: ${err.message}`);
                console.error('❌ Error detallado al cargar catálogos:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCatalogs();
    }, [autoPopulateFields]);

    useEffect(() => {
        if (vehiculos.length > 0 && colores.length > 0) {

            if (formData.vehiculoId) {
                autoPopulateFields(formData.vehiculoId, vehiculos, colores);

            } else {
                setFormData(prev => ({
                    ...prev,
                    marcaId: '',
                    modeloId: '',
                    year: '',
                    placas: '',
                    colorId: '',
                    kilometraje: '',
                }));
            }
        }
    }, [formData.vehiculoId, vehiculos, colores, autoPopulateFields]); // OK en dependencias

    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        const newValue =
            (type === 'number' || name === 'kilometraje' || name === 'year')
                ? (value ? Number(value) : '')
                : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));
    }, []);

    const handleSelectChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleFuelChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, gasolina: parseInt(e.target.value) }));
    }, []);

    const getBrandName = (id) => {
        const brand = marcas.find(b => b.id === id);
        return brand?.name || '';
    };

    const getColorName = (id) => {
        const color = colores.find(c => c.id === id);
        return color?.name || '';
    };

    const getModelNameFromVehicle = () => {
        const selectedVehicle = vehiculos.find(v => v.id === formData.vehiculoId);
        return selectedVehicle?.data?.Modelo || '';
    };

    // IMPLEMENTACIÓN DE LA LÓGICA DE CONEXIÓN A LA API (CORREGIDO)
    const handleNext = async () => {
        const existingInformacionId = datosAnteriores?.informacionGeneral?.informacionId;

        // Validación básica de campos requeridos
        if (!formData.vehiculoId || formData.kilometraje === '') {
            setError('Por favor selecciona un Vehículo y completa el Kilometraje.');
            return;
        }

        // Validación de datos del vehículo cargados automáticamente
        if (!formData.marcaId || !formData.modeloId || !formData.year || !formData.placas || !formData.colorId) {
            setError('Error: Los datos automáticos del vehículo no se han cargado correctamente. Revisa la selección.');
            return;
        }

        // Mapear datos del formulario local al InformacionDto del backend
        const InformacionDto = {
            MarcaId: formData.marcaId, // Ya viene como marcaID de la API
            ModeloId: formData.modeloId, // Ya viene como modeloID de la API
            Año: formData.year,
            Placas: formData.placas.toUpperCase().trim(),
            ColorId: formData.colorId, // Puede ser string o ID según tu backend
            Kilometraje: parseFloat(formData.kilometraje),
            NivelGasolina: parseFloat((formData.gasolina / 100).toFixed(2)),
            VehicleCatalogId: formData.vehiculoId,

            Marca: getBrandName(formData.marcaId),
            Modelo: getModelNameFromVehicle(),
            Color: getColorName(formData.colorId),
        };


        setIsLoading(true);
        setError(null);

        try {
            let newInspeccion;

            if (existingInformacionId && existingInformacionId !== 0) {
                // Caso A: YA EXISTE EL ID (Actualización local)
                newInspeccion = {
                    ...datosAnteriores,
                    informacionGeneral: {
                        ...datosAnteriores.informacionGeneral,
                        ...InformacionDto,
                        informacionId: existingInformacionId
                    }
                };
            } else {
                // Caso B: NO EXISTE EL ID (Creación)
                newInspeccion = await base44.entities.SistemaEntrega.crearInspeccion(InformacionDto);

                const createdId = newInspeccion.entregaConfirmacion?.informacionId || newInspeccion.informacionGeneral?.informacionId;

                if (createdId) {
                    newInspeccion = {
                        ...newInspeccion,
                        informacionGeneral: {
                            ...newInspeccion.informacionGeneral,
                            ...InformacionDto,
                            informacionId: createdId
                        }
                    };
                    toast.success('Entrega del vehículo registrada con éxito');
                } else {
                    throw new Error("La API no devolvió el ID de información general después de la creación.");
                }
            }

            // Éxito: Llamar a la función onNext
            if (onNext) {
                onNext(newInspeccion);
            }
        } catch (err) {
            // Manejo de errores de la API
            const errorMessage = err.message || 'Ocurrió un error al crear/actualizar la inspección';
            setError(errorMessage);
            console.error('❌ API Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevious = () => {
        // En el Paso 1, 'Anterior' no hace nada o regresa al inicio del flujo
    };

    return (
        <div className="min-h-screen  from-blue-50 via-white to-purple-50 py-8">
            <div className="flex flex-col items-center">
                {/* Título */}
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

                {/* Formulario */}
                <div className="w-full max-w-5xl bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                        Información General <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">del Vehículo</span>
                    </h2>

                    {/* Muestra errores de la API */}
                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
                            <span className="font-medium">⚠️ Error:</span> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vehículo Existente */}
                        <div className="md:col-span-2">
                            <CustomSelect
                                label="Vehículo Existente"
                                fieldName="vehiculoId"
                                value={formData.vehiculoId}
                                onChange={handleSelectChange}
                                options={vehiculos}
                                required
                            />
                        </div>

                        {/* Marca (SOLO LECTURA) */}
                        <FormField
                            label="Marca"
                            name="marcaDisplay"
                            value={getBrandName(formData.marcaId)}
                            readOnly={true}
                        />

                        {/* Modelo (SOLO LECTURA) */}
                        <FormField
                            label="Modelo"
                            name="modeloDisplay"
                            value={getModelNameFromVehicle()}
                            readOnly={true}
                        />

                        {/* Año */}
                        <FormField
                            label="Año"
                            name="year"
                            value={formData.year}
                            type="number"
                            required
                            onChange={handleChange}
                            min="1900"
                        />

                        {/* Placas */}
                        <FormField
                            label="Placas"
                            name="placas"
                            value={formData.placas}
                            required
                            onChange={handleChange}
                        />

                        <CustomSelect
                            label="Color" // Agrega la etiqueta (label)
                            fieldName="colorId"
                            value={formData.colorId}
                            onChange={handleSelectChange}
                            options={colores}
                            required
                        />
                        {/* Kilometraje */}
                        <FormField
                            label="Kilometraje"
                            name="kilometraje"
                            value={formData.kilometraje}
                            type="number"
                            required
                            onChange={handleChange}
                            min="0"
                        />

                        {/* Nivel de Gasolina */}
                        <div className="md:col-span-2">
                            <FuelSlider percentage={formData.gasolina} onChange={handleFuelChange} />
                        </div>
                    </div>
                </div>

                {/* Botones de Navegación */}
                <div className="w-full max-w-5xl flex justify-between mt-10">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className="px-8 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold transition-all duration-200
                         hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Anterior</span>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold transition-all duration-200
                         hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Procesando...</span>
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

export default Paso1;