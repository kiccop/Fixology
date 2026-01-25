'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Bike,
    Plus,
    Settings,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    MoreVertical,
    Star,
    Edit,
    Trash2,
    RotateCcw,
    History,
    FileText,
    Wrench,
} from 'lucide-react'
import { Card, Button, ProgressBar, Badge, Modal } from '@/components/ui'
import { AddComponentModal } from './AddComponentModal'
import { AddMaintenanceModal } from './AddMaintenanceModal'
import { createClient } from '@/lib/supabase/client'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { it, enUS, es, fr } from 'date-fns/locale'
import { useLocale } from 'next-intl'

interface BikeDetailContentProps {
    bike: any
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

export function BikeDetailContent({ bike }: BikeDetailContentProps) {
    const t = useTranslations('components')
    const tBikes = useTranslations('bikes')
    const tMaintenance = useTranslations('maintenance')
    const locale = useLocale()
    const router = useRouter()
    const supabase = createClient()

    const [addComponentOpen, setAddComponentOpen] = useState(false)
    const [addMaintenanceOpen, setAddMaintenanceOpen] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState<any>(null)
    const [actionModalOpen, setActionModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const components = bike.components || []
    const activeComponents = components.filter((c: any) => c.status !== 'replaced')
    const replacedComponents = components.filter((c: any) => c.status === 'replaced')

    const generatePDF = () => {
        try {
            const doc = new jsPDF()
            const dateLocale = locale === 'it' ? it : locale === 'es' ? es : locale === 'fr' ? fr : enUS
            const today = format(new Date(), 'PPP', { locale: dateLocale })

            // Colors
            const primaryColor: [number, number, number] = [255, 107, 53] // #ff6b35

            // Header
            doc.setFontSize(22)
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
            doc.text('FIXOLOGY', 105, 20, { align: 'center' })

            doc.setFontSize(16)
            doc.setTextColor(60, 60, 60)
            doc.text(tBikes('serviceReport'), 105, 30, { align: 'center' })

            // Bike Info Box
            doc.setDrawColor(230, 230, 230)
            doc.setFillColor(248, 248, 248)
            doc.roundedRect(14, 40, 182, 35, 3, 3, 'FD')

            doc.setFontSize(14)
            doc.setTextColor(0, 0, 0)
            doc.text(`${bike.brand} ${bike.model}`, 20, 50)
            doc.setFontSize(18)
            doc.text(bike.name, 20, 60)

            doc.setFontSize(11)
            doc.setTextColor(100, 100, 100)
            doc.text(`Km Totali: ${bike.total_km?.toLocaleString()} km`, 190, 50, { align: 'right' })
            doc.text(`Data Report: ${today}`, 190, 60, { align: 'right' })

            // Active Components Table
            doc.setFontSize(14)
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
            doc.text(t('title'), 14, 90)

            const componentRows = activeComponents.map((c: any) => [
                t(`types.${c.type}`),
                `${c.current_km} / ${c.threshold_km || '∞'} km`,
                t(`status.${c.status}`).toUpperCase(),
                format(new Date(c.install_date || new Date()), 'dd/MM/yyyy')
            ])

            autoTable(doc, {
                startY: 95,
                head: [['Componente', 'Chilometraggio', 'Stato', 'Data Installazione']],
                body: componentRows,
                headStyles: { fillColor: [40, 40, 40] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                styles: { fontSize: 10 }
            })

            // Maintenance History (from logs if available)
            const allLogs: any[] = []
            components.forEach((c: any) => {
                if (c.maintenance_logs) {
                    c.maintenance_logs.forEach((log: any) => {
                        allLogs.push({
                            ...log,
                            componentName: t(`types.${c.type}`)
                        })
                    })
                }
            })

            if (allLogs.length > 0) {
                const lastY = (doc as any).lastAutoTable.finalY || 150
                const nextY = lastY + 15
                doc.setFontSize(14)
                doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
                doc.text(tMaintenance('title'), 14, nextY)

                const logRows = allLogs
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map(log => [
                        format(new Date(log.created_at), 'dd/MM/yyyy'),
                        log.componentName,
                        tMaintenance(`actions.${log.action_type}`),
                        `${log.km_at_action?.toLocaleString()} km`,
                        log.cost ? `${log.cost} €` : '-',
                        log.receipt_url ? 'SI' : 'NO'
                    ])

                autoTable(doc, {
                    startY: nextY + 5,
                    head: [['Data', 'Componente', 'Azione', 'Km', 'Costo', 'Allegato']],
                    body: logRows,
                    headStyles: { fillColor: primaryColor },
                    alternateRowStyles: { fillColor: [250, 250, 250] },
                    styles: { fontSize: 10 }
                })
            }

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(9)
                doc.setTextColor(150, 150, 150)
                doc.text(
                    'Generato da Fixology - La tua bici, sempre al massimo.',
                    105,
                    285,
                    { align: 'center' }
                )
            }

            doc.save(`Libretto_${bike.name.replace(/\s+/g, '_')}.pdf`)
            toast.success('Libretto generato con successo!')
        } catch (error) {
            console.error('PDF Generation error:', error)
            toast.error('Errore durante la generazione del PDF. Riprova.')
        }
    }

    const handleResetComponent = async (component: any) => {
        setIsLoading(true)
        try {
            // Create maintenance log for replacement
            await supabase.from('maintenance_logs').insert({
                component_id: component.id,
                action_type: 'replaced',
                km_at_action: component.current_km + component.install_km,
                hours_at_action: component.current_hours + component.install_hours,
            })

            // Reset component
            await supabase
                .from('components')
                .update({
                    install_km: bike.total_km,
                    install_hours: bike.total_hours || 0,
                    current_km: 0,
                    current_hours: 0,
                    status: 'ok',
                    install_date: new Date().toISOString().split('T')[0],
                })
                .eq('id', component.id)

            toast.success('Componente resettato')
            router.refresh()
        } catch {
            toast.error('Errore durante il reset')
        } finally {
            setIsLoading(false)
            setActionModalOpen(false)
            setSelectedComponent(null)
        }
    }

    const handleDeleteComponent = async (component: any) => {
        setIsLoading(true)
        try {
            await supabase.from('components').delete().eq('id', component.id)
            toast.success('Componente eliminato')
            router.refresh()
        } catch {
            toast.error('Errore durante l\'eliminazione')
        } finally {
            setIsLoading(false)
            setActionModalOpen(false)
            setSelectedComponent(null)
        }
    }

    const calculateWear = (component: any) => {
        if (component.threshold_km && component.threshold_km > 0) {
            return (component.current_km / component.threshold_km) * 100
        }
        if (component.threshold_hours && component.threshold_hours > 0) {
            return (component.current_hours / component.threshold_hours) * 100
        }
        return 0
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeIn}>
                <Link
                    href="/dashboard/bikes"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-100 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Torna alle bici</span>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                            <Bike className="w-8 h-8 text-primary-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl lg:text-3xl font-bold">{bike.name}</h1>
                                {bike.is_primary && (
                                    <Star className="w-5 h-5 text-warning-400 fill-warning-400" />
                                )}
                            </div>
                            <p className="text-neutral-400">
                                {bike.brand} {bike.model} • {bike.total_km?.toLocaleString() || 0} km
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={generatePDF}
                            icon={<History className="w-4 h-4" />}
                        >
                            <span className="hidden sm:inline">{tBikes('downloadServiceBooklet')}</span>
                            <span className="sm:hidden">PDF</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setAddMaintenanceOpen(true)}
                            icon={<Wrench className="w-4 h-4" />}
                        >
                            <span className="hidden sm:inline">Log Intervento</span>
                            <span className="sm:hidden">Log</span>
                        </Button>
                        <Button
                            onClick={() => setAddComponentOpen(true)}
                            icon={<Plus className="w-4 h-4" />}
                        >
                            {t('addComponent')}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Componenti</p>
                        <p className="text-2xl font-bold">{activeComponents.length}</p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">OK</p>
                        <p className="text-2xl font-bold text-success-400">
                            {activeComponents.filter((c: any) => c.status === 'ok').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Attenzione</p>
                        <p className="text-2xl font-bold text-warning-400">
                            {activeComponents.filter((c: any) => c.status === 'warning').length}
                        </p>
                    </div>
                </Card>
                <Card>
                    <div className="text-center">
                        <p className="text-sm text-neutral-400">Da sostituire</p>
                        <p className="text-2xl font-bold text-danger-400">
                            {activeComponents.filter((c: any) => c.status === 'danger').length}
                        </p>
                    </div>
                </Card>
            </motion.div>

            {/* Components List */}
            <motion.div variants={fadeIn}>
                <Card padding="none">
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary-400" />
                            {t('title')}
                        </h2>
                    </div>

                    {activeComponents.length === 0 ? (
                        <div className="p-8 text-center">
                            <Settings className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                            <p className="text-neutral-400 mb-4">{t('noComponentsDescription')}</p>
                            <Button
                                onClick={() => setAddComponentOpen(true)}
                                icon={<Plus className="w-4 h-4" />}
                            >
                                {t('addComponent')}
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {activeComponents.sort((a: any, b: any) => {
                                const order = { danger: 0, warning: 1, ok: 2 }
                                return (order[a.status as keyof typeof order] || 3) - (order[b.status as keyof typeof order] || 3)
                            }).map((component: any) => {
                                const wear = calculateWear(component)

                                return (
                                    <div
                                        key={component.id}
                                        className="p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          ${component.status === 'danger'
                                                        ? 'bg-danger-500/20 text-danger-400'
                                                        : component.status === 'warning'
                                                            ? 'bg-warning-500/20 text-warning-400'
                                                            : 'bg-success-500/20 text-success-400'
                                                    }
                        `}>
                                                    {component.status === 'danger' ? (
                                                        <AlertTriangle className="w-5 h-5" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{t(`types.${component.type}`)}</h3>
                                                    <p className="text-sm text-neutral-400">
                                                        {component.current_km} km / {component.threshold_km || '∞'} km
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge status={component.status}>
                                                    {t(`status.${component.status}`)}
                                                </Badge>
                                                <button
                                                    onClick={() => {
                                                        setSelectedComponent(component)
                                                        setActionModalOpen(true)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                                >
                                                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <ProgressBar
                                            value={wear}
                                            showLabel
                                            size="sm"
                                        />

                                        {component.notes && (
                                            <p className="mt-2 text-sm text-neutral-500 italic">
                                                {component.notes}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Replaced Components History */}
            {replacedComponents.length > 0 && (
                <motion.div variants={fadeIn}>
                    <Card padding="none">
                        <div className="p-6 border-b border-white/5">
                            <h2 className="text-lg font-semibold text-neutral-400">
                                Componenti sostituiti ({replacedComponents.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5 opacity-80">
                            {replacedComponents.map((component: any) => (
                                <div key={component.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <RotateCcw className="w-4 h-4 text-neutral-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{t(`types.${component.type}`)}</p>
                                            <p className="text-[10px] text-neutral-500">Sostituito il {format(new Date(component.install_date), 'dd/MM/yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {component.maintenance_logs?.some((l: any) => l.receipt_url) && (
                                            <a
                                                href={component.maintenance_logs.find((l: any) => l.receipt_url).receipt_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-md hover:bg-white/10 text-primary-400 transition-colors"
                                                title="Visualizza ricevuta"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        )}
                                        <Badge status="replaced" size="sm">Sostituito</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Add Component Modal */}
            <AddComponentModal
                isOpen={addComponentOpen}
                onClose={() => setAddComponentOpen(false)}
                bikeId={bike.id}
                currentBikeKm={bike.total_km || 0}
            />

            <AddMaintenanceModal
                isOpen={addMaintenanceOpen}
                onClose={() => setAddMaintenanceOpen(false)}
                bikeId={bike.id}
                components={activeComponents}
                currentBikeKm={bike.total_km || 0}
            />

            {/* Component Action Modal */}
            <Modal
                isOpen={actionModalOpen}
                onClose={() => {
                    setActionModalOpen(false)
                    setSelectedComponent(null)
                }}
                title={selectedComponent ? t(`types.${selectedComponent.type}`) : ''}
                size="sm"
            >
                {selectedComponent && (
                    <div className="space-y-3">
                        <button
                            onClick={() => handleResetComponent(selectedComponent)}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 text-primary-400" />
                            <div className="text-left">
                                <p className="font-medium">{t('resetComponent')}</p>
                                <p className="text-sm text-neutral-400">Segna come sostituito e azzera i km</p>
                            </div>
                        </button>

                        <button
                            onClick={() => handleDeleteComponent(selectedComponent)}
                            disabled={isLoading}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-danger-500/10 text-danger-400 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                            <div className="text-left">
                                <p className="font-medium">Elimina</p>
                                <p className="text-sm opacity-70">Rimuovi definitivamente</p>
                            </div>
                        </button>
                    </div>
                )}
            </Modal>
        </motion.div>
    )
}
