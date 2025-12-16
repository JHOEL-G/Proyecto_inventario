import React, { useState, useCallback, useEffect } from 'react';
import Paso1 from "../components/formulario/Paso1";
import Paso2 from "../components/formulario/Paso2";
import Paso3 from '../components/formulario/Paso3';
import Paso4 from '../components/formulario/Paso4';
import Paso5 from '../components/formulario/Paso5';
import Paso6 from '../components/formulario/Paso6';
import { CheckCircle } from 'lucide-react';
import ResumenEntregaCard from '../components/formulario/ResumenEntregaCard';
import { base44 } from '../api/base44Client';
import { toast } from 'sonner';

export function SistemaEntrega() {
    const [pasoActual, setPasoActual] = useState(1);
    const [inspeccionId, setInspeccionId] = useState(null);
    const [formularioFinalizado, setFormularioFinalizado] = useState(false);
    const [datosFinales, setDatosFinales] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [datosFormulario, setDatosFormulario] = useState({
        paso1: {},
        paso2: {},
        paso3: {},
        paso4: {},
        paso5: {},
        paso6: {}
    });

    // Cargar usuarios al montar el componente
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const listaUsuarios = await base44.entities.SistemaEntrega.obtenerPersonal();
                setUsuarios(listaUsuarios);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                toast.error('No se pudieron cargar los usuarios');
            }
        };

        cargarUsuarios();
    }, []);

    const handleSiguientePaso = useCallback((datosPaso) => {
        if (pasoActual === 1 && datosPaso?.informacionGeneral?.informacionId) {
            setInspeccionId(datosPaso.informacionGeneral.informacionId);
        }
        setDatosFormulario(prev => ({
            ...prev,
            [`paso${pasoActual}`]: datosPaso
        }));
        if (pasoActual < 6) {
            setPasoActual(prev => prev + 1);
        }
    }, [pasoActual]);

    const handleFinalizarFormulario = useCallback(async (datosPaso6) => {
        if (!inspeccionId) {
            alert("ID de Inspección faltante. No se puede guardar la entrega.");
            return;
        }

        const entregaConfirmacionDto = datosPaso6;

        try {
            await base44.entities.SistemaEntrega.actualizarEntrega(inspeccionId, entregaConfirmacionDto);
            await base44.entities.SistemaEntrega.finalizar(inspeccionId);

            const datosConsolidados = {
                informacionId: inspeccionId,
                ...datosFormulario.paso1,
                ...datosFormulario.paso2,
                ...datosFormulario.paso3,
                ...datosFormulario.paso4,
                ...datosFormulario.paso5,
                confirmacionEntrega: datosPaso6
            };
            setDatosFinales(datosConsolidados);
            setDatosFormulario(prev => ({ ...prev, paso6: datosPaso6 }));
            setFormularioFinalizado(true);
            toast.success('Proceso de entrega finalizado correctamente');

        } catch (error) {
            console.error("Error al finalizar el proceso de entrega:", error);
            let errorMessage = `ERROR: No se pudo completar la operación. Mensaje: ${error.message}`;
            if (error.message.includes('400')) {
                errorMessage = '❌ Error de Validación: El servidor rechazó la finalización. Verifica que todos los pasos estén completos.';
            }
            alert(errorMessage);
        }
    }, [inspeccionId, datosFormulario]);

    const handlePasoAnterior = useCallback(() => {
        setPasoActual(prev => Math.max(1, prev - 1));
    }, []);

    const handleReiniciar = () => {
        setPasoActual(1);
        setInspeccionId(null);
        setFormularioFinalizado(false);
        setDatosFinales({});
        setDatosFormulario({ paso1: {}, paso2: {}, paso3: {}, paso4: {}, paso5: {}, paso6: {} });
    };

    if (formularioFinalizado) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
                <div className="text-center mb-10">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-4xl font-extrabold text-gray-800">Entrega Confirmada</h1>
                    <p className="text-xl text-gray-600 mt-2">El proceso de inspección y entrega ha finalizado con éxito.</p>
                </div>
                <ResumenEntregaCard
                    datos={datosFinales}
                    onReiniciar={handleReiniciar}
                    usuarios={usuarios}
                />
            </div>
        );
    }

    return (
        <div>
            {pasoActual === 1 && (
                <Paso1
                    onNext={handleSiguientePaso}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso1}
                />
            )}

            {pasoActual === 2 && (
                <Paso2
                    onNext={handleSiguientePaso}
                    onPrevious={handlePasoAnterior}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso2}
                    informacionId={inspeccionId}
                />
            )}

            {pasoActual === 3 && (
                <Paso3
                    onNext={handleSiguientePaso}
                    onPrevious={handlePasoAnterior}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso3}
                    informacionId={inspeccionId}
                />
            )}

            {pasoActual === 4 && (
                <Paso4
                    onNext={handleSiguientePaso}
                    onPrevious={handlePasoAnterior}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso4}
                    informacionId={inspeccionId}
                />
            )}

            {pasoActual === 5 && (
                <Paso5
                    onNext={handleSiguientePaso}
                    onPrevious={handlePasoAnterior}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso5}
                    informacionId={inspeccionId}
                />
            )}

            {pasoActual === 6 && (
                <Paso6
                    onFinalize={handleFinalizarFormulario}
                    onPrevious={handlePasoAnterior}
                    currentStep={pasoActual}
                    datosAnteriores={datosFormulario.paso5}
                    informacionId={inspeccionId}
                />
            )}
        </div>
    );
}