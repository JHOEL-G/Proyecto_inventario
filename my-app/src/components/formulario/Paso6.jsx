import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, User, CheckCircle, FileSignature, Calendar, CreditCard, MessageSquare, Car, Info, AlertCircle } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import Tooltip from '../../hooks/Tooltip ';

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

const SignaturePad = ({ label, onSignatureChange, initialSignature }) => {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastCoords = useRef({ x: 0, y: 0 });
    const [hasSigned, setHasSigned] = useState(!!initialSignature);

    const initCanvas = useCallback(() => {
        if (isDrawing.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        canvas.width = parent.offsetWidth;
        canvas.height = 200;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (initialSignature) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                setHasSigned(true);
            };
            img.src = initialSignature;
        } else {
            setHasSigned(false);
        }
    }, [initialSignature]);

    useEffect(() => {
        initCanvas();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleStart = (e) => {
            e.preventDefault();
            isDrawing.current = true;

            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            lastCoords.current = {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const handleMove = (e) => {
            if (!isDrawing.current) return;
            e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(lastCoords.current.x, lastCoords.current.y);
            ctx.lineTo(x, y);
            ctx.stroke();

            lastCoords.current = { x, y };

            setHasSigned(true);
            if (onSignatureChange) {
                onSignatureChange(canvas.toDataURL());
            }
        };

        const handleEnd = () => {
            isDrawing.current = false;
        };

        canvas.addEventListener("mousedown", handleStart);
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("mouseup", handleEnd);
        canvas.addEventListener("mouseout", handleEnd);

        canvas.addEventListener("touchstart", handleStart, { passive: false });
        canvas.addEventListener("touchmove", handleMove, { passive: false });
        canvas.addEventListener("touchend", handleEnd);
        canvas.addEventListener("touchcancel", handleEnd);

        return () => {
            canvas.removeEventListener("mousedown", handleStart);
            canvas.removeEventListener("mousemove", handleMove);
            canvas.removeEventListener("mouseup", handleEnd);
            canvas.removeEventListener("mouseout", handleEnd);

            canvas.removeEventListener("touchstart", handleStart);
            canvas.removeEventListener("touchmove", handleMove);
            canvas.removeEventListener("touchend", handleEnd);
            canvas.removeEventListener("touchcancel", handleEnd);
        };
    }, [initCanvas, onSignatureChange]);

    const handleClear = () => {
        isDrawing.current = false;

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        setHasSigned(false);
        if (onSignatureChange) onSignatureChange(null);
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium mb-3">{label}</label>
            <div className="relative bg-white border-2 rounded-xl overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full touch-none"
                    style={{ cursor: "crosshair" }}
                />
                {!hasSigned && (
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300 pointer-events-none select-none">
                        Firme aquí
                    </p>
                )}
            </div>

            <button
                onClick={handleClear}
                type="button"
                className="mt-3 px-5 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
                Limpiar Firma
            </button>
        </div>
    );
};

const CustomSelect = ({ label, value, onChange, options, required = false, icon: Icon }) => {
    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                required={required}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

const RecepcionDetails = ({ formData, handleChange, handleSignatureChange, datosAnteriores, userList, loadingUsers }) => {
    const [tipoEntregaOptions, setTipoEntregaOptions] = useState([{ value: '', label: 'Cargando tipos de entrega...' }]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCatalogsFromAPI = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const allTiposEntrega = await base44.entities.SistemaEntrega.obtenerEstados('TIPO_ENTREGA');

                const tiposEntregaMapped = allTiposEntrega.map(e => ({
                    value: e.estadoId?.toString() || e.nombreEstado,
                    label: e.nombreEstado
                }));

                setTipoEntregaOptions([
                    { value: '', label: 'Selecciona un tipo de entrega...' },
                    ...tiposEntregaMapped
                ]);

            } catch (err) {
                console.error('ERROR en Carga de Catálogos de Tipo de Entrega:', err);
                setError('No se pudieron cargar los tipos de entrega desde la API.');
                setTipoEntregaOptions([{ value: '', label: 'Error al cargar tipos de entrega' }]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalogsFromAPI();
    }, []);

    return (
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Recepción del Vehículo (Paso 2/2)
                    <Tooltip
                        content="Complete todos los datos del receptor y su firma digital"
                        position="right"
                    >
                        <Info className="hidden sm:inline-block w-4 h-4 text-green-100 hover:text-white transition-colors" />
                    </Tooltip>
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {error && (
                    <div className="p-3 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <CustomSelect
                    label="Usuario Receptor del Vehículo"
                    value={formData.recepcion_usuario_id || ''}
                    onChange={(value) => handleChange({ target: { name: 'recepcion_usuario_id', value } })}
                    options={userList}
                    required
                    icon={User}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        Tipo de Entrega
                        <span className="text-red-500">*</span>
                        <Tooltip content="Seleccione el tipo de entrega según el acuerdo comercial" position="right">
                            <Info className="hidden sm:inline-block w-4 h-4 text-green-400 hover:text-green-600 transition-colors" />
                        </Tooltip>
                    </label>
                    <select
                        value={formData.recepcion_tipo_entrega || ''}
                        onChange={(e) => handleChange({ target: { name: 'recepcion_tipo_entrega', value: e.target.value } })}
                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 hover:border-gray-300"
                        required
                        disabled={isLoading}
                    >
                        {tipoEntregaOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        Credit ID (si aplica)
                        <Tooltip content="Ingrese el ID de crédito solo si el tipo de entrega es 'Por Crédito'" position="right">
                            <Info className="hidden sm:inline-block w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </Tooltip>
                    </label>
                    <input
                        type="text"
                        name="recepcion_credit_id"
                        value={formData.recepcion_credit_id || ''}
                        onChange={handleChange}
                        placeholder="Ingrese el Credit ID"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Notas u Observaciones
                        <Tooltip content="Agregue cualquier detalle importante sobre la recepción del vehículo" position="right">
                            <Info className="hidden sm:inline-block w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </Tooltip>
                    </label>
                    <textarea
                        name="recepcion_notas"
                        value={formData.recepcion_notas || ''}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Ingrese cualquier observación adicional..."
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.recepcion_notas?.length || 0}/500 caracteres</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        Fecha estimada de devolución (Opcional)
                        <Tooltip content="Fecha aproximada en la que se espera devolver el vehículo (solo para préstamos/rentas)" position="top">
                            <Info className="hidden sm:inline-block w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </Tooltip>
                    </label>
                    <input
                        type="date"
                        name="recepcion_fecha_devolucion"
                        value={formData.recepcion_fecha_devolucion || ''}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                </div>

                <div className={`rounded-xl p-3 border-2 flex items-center gap-3 
                    ${formData.recepcion_firma ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>

                    <div className={`flex-shrink-0 flex items-center justify-center 
                        ${formData.recepcion_firma ? 'w-8 h-8 bg-green-500 rounded-full' : 'p-1.5 rounded-lg bg-amber-100'}`}>
                        {formData.recepcion_firma ? (
                            <span className="text-white text-lg font-bold">✓</span>
                        ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        )}
                    </div>

                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            {formData.recepcion_firma ? (
                                <>
                                    <p className="text-sm font-semibold text-green-800">Firma Registrada Exitosamente</p>
                                    <p className="text-xs text-green-700">Recepción confirmada</p>
                                </>
                            ) : (
                                <>
                                    <h5 className="font-bold text-amber-900 text-sm">Compromiso Legal</h5>
                                    <p className="text-xs text-amber-700">Su firma certifica la recepción del vehículo</p>
                                </>
                            )}
                        </div>

                        {!formData.recepcion_firma && (
                            <Tooltip
                                content="Esta firma confirma que acepta la responsabilidad del vehículo bajo los términos acordados"
                                position="left"
                            >
                                <Info className="hidden sm:inline-block w-5 h-5 text-amber-600 hover:text-amber-700 transition-colors cursor-help" />
                            </Tooltip>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t-2 border-green-200">
                    <SignaturePad
                        label="Firma del Receptor del Vehículo *"
                        onSignatureChange={(data) => handleSignatureChange('recepcion_firma', data)}
                        initialSignature={formData.recepcion_firma}
                    />
                </div>
            </div>
        </div>
    );
};

const SignaturesCarousel = ({ formData, handleChange, handleSignatureChange, datosAnteriores }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 2;

    // Estados para usuarios que entregan (personal)
    const [userList, setUserList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [userError, setUserError] = useState(null);

    // Estados para conductores que reciben
    const [conductoresList, setConductoresList] = useState([]);
    const [loadingConductores, setLoadingConductores] = useState(true);

    // Estados para información del vehículo
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [brandsList, setBrandsList] = useState([]);
    const [modelsList, setModelsList] = useState([]);
    const [colorsList, setColorsList] = useState([]);

    // Cargar catálogos de marcas y colores
    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                const [brandsResponse, colorsResponse] = await Promise.all([
                    base44.entities.Brand.list(),
                    base44.entities.Vehicle.getColorOptions()
                ]);

                setBrandsList(Array.isArray(brandsResponse) ? brandsResponse : brandsResponse?.data || []);
                setColorsList(Array.isArray(colorsResponse) ? colorsResponse : colorsResponse?.data || []);
            } catch (error) {
                console.error("Error cargando catálogos:", error);
            }
        };

        loadCatalogs();
    }, []);

    // Cargar información del vehículo
    useEffect(() => {
        const loadVehicleInfo = async () => {
            if (!formData.informacion_id) return;

            try {
                const response = await base44.entities.SistemaEntrega.obtenerInspeccion(formData.informacion_id);
                setVehicleInfo(response);
            } catch (error) {
                console.error("Error cargando info del vehículo:", error);
            }
        };

        loadVehicleInfo();
    }, [formData.informacion_id]);

    // Cargar modelos cuando tengamos marcaId
    const infoGeneral = vehicleInfo?.informacionGeneral || datosAnteriores?.informacionGeneral || {};

    useEffect(() => {
        const loadModels = async () => {
            if (!infoGeneral.marcaId) return;

            try {
                const modelsResponse = await base44.entities.Brand.getModels(infoGeneral.marcaId);
                setModelsList(Array.isArray(modelsResponse) ? modelsResponse : modelsResponse?.data || []);
            } catch (error) {
                console.error("Error cargando modelos:", error);
            }
        };

        loadModels();
    }, [infoGeneral.marcaId]);

    // Mapear IDs a nombres
    const brandObj = brandsList.find(b => b.marcaId === infoGeneral.marcaId);
    const modelObj = modelsList.find(m => m.modeloId === infoGeneral.modeloId);
    const colorObj = colorsList.find(c => c.colorId === infoGeneral.colorId);

    const placas = infoGeneral.placas || 'N/A';
    const marcaName = brandObj?.marca || 'N/A';
    const modeloName = modelObj?.modelo || 'N/A';
    const colorName = colorObj?.nombreColor || 'N/A';

    // Cargar personal que entrega
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            setUserError(null);

            try {
                const response = await base44.entities.SistemaEntrega.obtenerPersonal();
                const apiData = Array.isArray(response) ? response : response?.data || [];

                if (apiData.length === 0) {
                    setUserList([{ value: '', label: 'No hay usuarios disponibles' }]);
                    return;
                }

                const mappedUsers = apiData
                    .map(user => ({
                        value: user.personaId?.toString() || '',
                        label: user.displayText || `${user.nombreCompleto || 'Sin nombre'} ${user.rol ? `(${user.rol})` : ''}`.trim()
                    }))
                    .filter(user => user.value);

                setUserList([{ value: '', label: 'Selecciona un usuario...' }, ...mappedUsers]);
            } catch (error) {
                console.error("Error al cargar personal:", error);
                setUserError('Error al conectar con el catálogo de personal');
                setUserList([{ value: '', label: 'Error al cargar usuarios' }]);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, []);

    // Cargar conductores que reciben
    useEffect(() => {
        const fetchConductores = async () => {
            setLoadingConductores(true);

            try {
                const response = await base44.entities.Conductores.list();
                const apiData = Array.isArray(response) ? response : response?.data || [];

                if (apiData.length === 0) {
                    setConductoresList([{ value: '', label: 'No hay conductores disponibles' }]);
                    return;
                }

                const mappedConductores = apiData
                    .map(conductor => ({
                        value: conductor.conductorId?.toString() || conductor.id?.toString() || '',
                        label: `${conductor.nombre || conductor.nombreCompleto || 'Sin nombre'} ${conductor.licencia ? `(Lic: ${conductor.licencia})` : ''}`.trim()
                    }))
                    .filter(conductor => conductor.value);

                setConductoresList([{ value: '', label: 'Selecciona un conductor...' }, ...mappedConductores]);
            } catch (error) {
                console.error("Error al cargar conductores:", error);
                setConductoresList([{ value: '', label: 'Error al cargar conductores' }]);
            } finally {
                setLoadingConductores(false);
            }
        };

        fetchConductores();
    }, []);

    return (
        <div className="relative">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200">
                Firmas de <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Confirmación</span>
            </h2>

            {userError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-800 font-semibold">{userError}</p>
                </div>
            )}

            <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {/* SLIDE 1: Responsable de Entrega */}
                    <div className="min-w-full px-2">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <User className="w-6 h-6" />
                                    Responsable de Entrega (Paso 1/2)
                                    <Tooltip content="Complete todos los datos del responsable que entrega el vehículo" position="right">
                                        <Info className="hidden sm:inline-block w-4 h-4 text-blue-100 hover:text-white transition-colors" />
                                    </Tooltip>
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Usuario que Entrega */}
                                <CustomSelect
                                    label="Seleccionar Usuario que Entrega"
                                    value={formData.entrega_usuario}
                                    onChange={(value) => handleChange({ target: { name: 'entrega_usuario', value } })}
                                    options={userList}
                                    required
                                    icon={User}
                                />

                                {/* Información del vehículo y fecha */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Car className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-gray-800">Información del Vehículo</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Placas:</span>
                                                <span className="text-xs font-semibold text-gray-800">{placas}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Marca:</span>
                                                <span className="text-xs font-semibold text-gray-800">{marcaName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Modelo:</span>
                                                <span className="text-xs font-semibold text-gray-800">{modeloName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">Color:</span>
                                                <span className="text-xs font-semibold text-gray-800">{colorName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-gray-800">Fecha y Hora de Entrega</h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date().toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 mb-2">
                                            {new Date().toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <div className="mt-1 pt-2 border-t border-blue-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-600">Estado:</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                En proceso
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist de verificación */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Verificación Previa a la Entrega
                                        <Tooltip content="Estos pasos fueron completados en las secciones anteriores del formulario" position="right">
                                            <Info className="hidden sm:inline-block w-4 h-4 text-blue-400 hover:text-blue-600 transition-colors" />
                                        </Tooltip>
                                    </h4>
                                    <div className="space-y-2.5">
                                        {[
                                            'Inspección completa del vehículo realizada',
                                            'Documentación del vehículo verificada',
                                            'Condiciones del vehículo registradas correctamente',
                                            'Vehículo listo para ser entregado'
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start gap-3 text-sm">
                                                <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Responsabilidades al Entregar */}
                                <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <FileSignature className="w-5 h-5 text-blue-600" />
                                        Responsabilidades al Entregar el Vehículo
                                        <Tooltip content="Al firmar, usted confirma todos estos puntos" position="right">
                                            <Info className="hidden sm:inline-block w-4 h-4 text-blue-400 hover:text-blue-600 transition-colors" />
                                        </Tooltip>
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {[
                                            'Confirmo que el vehículo está en las condiciones registradas en este formulario',
                                            'He verificado todos los componentes, accesorios y documentos listados',
                                            'La información registrada es precisa, completa y refleja el estado actual',
                                            'El vehículo no presenta daños no reportados o condiciones ocultas',
                                            'Autorizo la transferencia temporal del vehículo al receptor designado'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-blue-600 font-bold mt-0.5">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Bloque de confirmación de firma */}
                                <div className={`rounded-xl p-4 border-2 flex items-center gap-3 transition-all duration-300
                                ${formData.entrega_firma ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                                    <div className={`flex-shrink-0 flex items-center justify-center 
                                    ${formData.entrega_firma ? 'w-10 h-10 bg-green-500 rounded-full' : 'w-10 h-10 rounded-full bg-amber-100'}`}>
                                        {formData.entrega_firma ? (
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6 text-amber-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        {formData.entrega_firma ? (
                                            <>
                                                <p className="text-sm font-bold text-green-800">✓ Firma Digital Registrada Exitosamente</p>
                                                <p className="text-xs text-green-700 mt-0.5">
                                                    Su firma ha sido capturada y guardada. Puede continuar al siguiente paso.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h5 className="font-bold text-amber-900 text-sm">Firma Digital Requerida</h5>
                                                <p className="text-xs text-amber-700 mt-0.5">
                                                    Su firma certifica la entrega del vehículo bajo los términos descritos
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Pad de firma */}
                                <SignaturePad
                                    label="Firma Digital del Responsable de Entrega *"
                                    onSignatureChange={(data) => handleSignatureChange('entrega_firma', data)}
                                    initialSignature={formData.entrega_firma}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 2: Quien Recibe el Vehículo */}
                    <div className="min-w-full px-2">
                        <RecepcionDetails
                            datosAnteriores={datosAnteriores}
                            formData={formData}
                            handleChange={handleChange}
                            handleSignatureChange={handleSignatureChange}
                            userList={conductoresList}
                        />
                    </div>
                </div>
            </div>

            {/* Controles de navegación */}
            <div className="mt-6 mb-8 px-2">
                {/* Versión Desktop */}
                <div className="hidden sm:flex justify-between items-center">
                    <button
                        onClick={() => setCurrentSlide(0)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentSlide === 0
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <User className="w-5 h-5" />
                        <span>Entrega</span>
                    </button>

                    <div className="flex gap-2">
                        {[...Array(totalSlides)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentSlide(1)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentSlide === 1
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <span>Recepción</span>
                        <CheckCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* Versión Móvil */}
                <div className="sm:hidden space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setCurrentSlide(0)}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${currentSlide === 0
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            <User className="w-6 h-6" />
                            <span className="text-sm">Entrega</span>
                        </button>

                        <button
                            onClick={() => setCurrentSlide(1)}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${currentSlide === 1
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            <CheckCircle className="w-6 h-6" />
                            <span className="text-sm">Recepción</span>
                        </button>
                    </div>

                    <div className="flex gap-2 justify-center">
                        {[...Array(totalSlides)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const Paso6 = ({ onNext, onPrevious, currentStep = 6, onFinalize, datosAnteriores = {}, informacionId }) => {
    const totalSteps = 6;

    const steps = [
        { number: 1, title: 'Información' },
        { number: 2, title: 'Exterior' },
        { number: 3, title: 'Llantas' },
        { number: 4, title: 'Fluidos/Interior' },
        { number: 5, title: 'Equipo' },
        { number: 6, title: 'Firmas' },
    ];

    const getInitialInformacionId = () => {
        return informacionId || datosAnteriores.InformacionId || null;
    };

    const [formData, setFormData] = useState({
        informacion_id: getInitialInformacionId(),
        entrega_usuario: '',
        entrega_firma: null,
        recepcion_usuario_id: '',
        recepcion_tipo_entrega: '',
        recepcion_credit_id: '',
        recepcion_notas: '',
        recepcion_fecha_devolucion: '',
        recepcion_firma: null, // ✅ Nueva firma para recepción
    });

    useEffect(() => {
        if (informacionId && informacionId !== formData.informacion_id) {
            setFormData(prev => ({
                ...prev,
                informacion_id: informacionId // Sobrescribe el ID
            }));
        }
    }, [informacionId]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }, []);

    const handleSignatureChange = useCallback((fieldName, signatureData) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: signatureData
        }));
    }, []);

    const handleFinish = () => {
        // ... (Validaciones: TODAS SE MANTIENEN IGUAL)
        if (!formData.informacion_id || parseInt(formData.informacion_id) <= 0) {
            alert('Error: Debe haber un ID de vehículo/información válido.');
            return;
        }
        // ... (Resto de las validaciones)

        const parseId = (value) => {
            const num = parseInt(value, 10);
            return isNaN(num) || num <= 0 ? null : num;
        };

        const entregaConfirmacionDto = {
            InformacionId: parseInt(formData.informacion_id),
            EntregaPersonaId: parseId(formData.entrega_usuario),
            FirmaEntregaData: formData.entrega_firma,
            RecibePersonaId: parseId(formData.recepcion_usuario_id),
            FirmaRecepcionData: formData.recepcion_firma,
            TipoEntrega: formData.recepcion_tipo_entrega,
            CreditId: formData.recepcion_credit_id || null,
            FechaDevolucionOpcional: formData.recepcion_fecha_devolucion || null,
            Notas: formData.recepcion_notas || null,
        };


        if (onFinalize) {
            // 🛑 ESTA FUNCIÓN DEBE SER REESCRITA EN EL COMPONENTE PADRE
            // para ejecutar la secuencia: GUARDAR PASO 6 (PUT) -> FINALIZAR (POST)
            onFinalize(entregaConfirmacionDto);
        } else if (onNext) {
            // Si no hay onFinalize, ejecuta onNext (probablemente también incorrecto para el último paso)
            onNext(entregaConfirmacionDto);
        }

        // 🛑 QUITE ESTA LÍNEA AQUÍ. La alerta debe ejecutarse solo DESPUÉS 
        // de que las llamadas asíncronas al servidor (guardar y finalizar) sean exitosas.
        // alert('¡Formulario completado exitosamente! Ambas firmas capturadas. 🎉');
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
                    <SignaturesCarousel
                        formData={formData}
                        handleChange={handleChange}
                        handleSignatureChange={handleSignatureChange}
                        datosAnteriores={datosAnteriores}
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
                        onClick={handleFinish}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold transition-all duration-200
                         hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                    >
                        <span>Finalizar</span>
                        <CheckCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Paso6;