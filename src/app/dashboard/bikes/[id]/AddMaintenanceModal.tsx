'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Upload, X, FileText, Check, Loader2 } from 'lucide-react'
import { Modal, Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface AddMaintenanceModalProps {
    isOpen: boolean
    onClose: () => void
    bikeId: string
    components: any[]
    currentBikeKm: number
    currentBikeHours?: number
}

export function AddMaintenanceModal({
    isOpen,
    onClose,
    bikeId,
    components,
    currentBikeKm,
    currentBikeHours = 0
}: AddMaintenanceModalProps) {
    const t = useTranslations('maintenance')
    const tComponents = useTranslations('components')
    const tCommon = useTranslations('common')
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState('')
    const [actionType, setActionType] = useState('maintained')
    const [kmAtAction, setKmAtAction] = useState(currentBikeKm.toString())
    const [hoursAtAction, setHoursAtAction] = useState(currentBikeHours.toString())
    const [cost, setCost] = useState('')
    const [notes, setNotes] = useState('')
    const [receiptUrl, setReceiptUrl] = useState('')
    const [fileName, setFileName] = useState('')

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File troppo grande (max 5MB)')
            return
        }

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${bikeId}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath)

            setReceiptUrl(publicUrl)
            setFileName(file.name)
            toast.success('File caricato correttamente')
        } catch (error: any) {
            console.error('Error uploading:', error)
            toast.error(`Errore caricamento: ${error.message || 'Controlla la console'}`)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedComponent) {
            toast.error('Seleziona un componente')
            return
        }

        setLoading(true)
        try {
            const km = parseFloat(kmAtAction)
            const hours = parseFloat(hoursAtAction)

            const { error } = await supabase.from('maintenance_logs').insert({
                component_id: selectedComponent,
                action_type: actionType,
                km_at_action: km,
                hours_at_action: hours,
                cost: cost ? parseFloat(cost) : null,
                notes,
                receipt_url: receiptUrl
            })

            if (error) throw error

            // Update component status and current usage if it's a replacement
            if (actionType === 'replaced') {
                await supabase.from('components').update({
                    install_km: km,
                    install_hours: hours,
                    current_km: Math.max(0, currentBikeKm - km),
                    current_hours: Math.max(0, currentBikeHours - hours),
                    install_date: new Date().toISOString().split('T')[0],
                    status: 'ok'
                }).eq('id', selectedComponent)
            }

            toast.success(tCommon('success'))
            onClose()
            window.location.reload() // Force refresh to see the new log
        } catch (error: any) {
            console.error('Save error:', error)
            toast.error(`Errore salvataggio: ${error.message || 'Controlla la console'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('addEntry')}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-neutral-800/50 border border-white/5 space-y-3">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1 block">Componente</label>
                        <select
                            className="input bg-neutral-900/50"
                            value={selectedComponent}
                            onChange={(e) => setSelectedComponent(e.target.value)}
                            required
                        >
                            <option value="">{tCommon('select')}...</option>
                            {components.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.is_custom ? c.name : tComponents(`types.${c.type}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1 block">{t('action')}</label>
                            <select
                                className="input bg-neutral-900/50"
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                            >
                                <option value="maintained">{t('actions.maintained')}</option>
                                <option value="replaced">{t('actions.replaced')}</option>
                                <option value="inspected">{t('actions.inspected')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold text-neutral-300 ml-1 mb-1 block">{t('kmAtAction')}</label>
                        <Input
                            type="number"
                            value={kmAtAction}
                            onChange={(e) => setKmAtAction(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-neutral-300 ml-1 mb-1 block">Ore al momento</label>
                        <Input
                            type="number"
                            value={hoursAtAction}
                            onChange={(e) => setHoursAtAction(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">{t('cost')} (€)</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="label">{t('receipt')}</label>
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                            />
                            {receiptUrl ? (
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-success-500/10 border border-success-500/20">
                                    <div className="flex items-center gap-2 text-success-400 text-sm overflow-hidden">
                                        <Check className="w-4 h-4" />
                                        <span className="truncate">{fileName}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReceiptUrl('')
                                            setFileName('')
                                        }}
                                        className="text-neutral-500 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-white/10 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all text-neutral-400 text-sm"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {t('uploadInProgress')}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            {t('uploadReceipt')}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1">{t('onlyImagesOrPdf')}</p>
                    </div>
                </div>

                <div>
                    <label className="label">{t('notes')}</label>
                    <textarea
                        className="input min-h-[80px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        fullWidth
                        onClick={onClose}
                    >
                        {tCommon('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                    >
                        {tCommon('save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
