// ============================================================
// MORNINGSTAR — CREATE CROP LOT PAGE
// Multi-step crop lot registration with AI grading simulation
// ============================================================

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wheat, MapPin, Calendar, UploadCloud,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Check
} from 'lucide-react'
import { createCropLot, uploadCropImage } from '@/api/crops'
import { Button, Input, Select, useToast } from '@/components/ui'
import type { SelectOption } from '@/components/ui'

const CROP_OPTIONS: SelectOption[] = [
  { value: 'Wheat', label: 'Wheat (गेहूं)' },
  { value: 'Rice / Paddy', label: 'Rice / Paddy (धान / चावल)' },
  { value: 'Soybean', label: 'Soybean (सोयाबीन)' },
  { value: 'Cotton', label: 'Cotton (कपास)' },
  { value: 'Maize', label: 'Maize (मक्का)' },
  { value: 'Chana / Gram', label: 'Chana / Bengal Gram (चना)' },
  { value: 'Mustard', label: 'Mustard (सरसों)' },
  { value: 'Onion', label: 'Onion (प्याज)' },
]

const STORAGE_OPTIONS: SelectOption[] = [
  { value: 'Warehouse', label: 'Registered Warehouse (गोदाम)' },
  { value: 'Cold Storage', label: 'Cold Storage (शीतगृह)' },
  { value: 'Farm Silo', label: 'Farm Silo / On-farm storage' },
  { value: 'Open Covered', label: 'Open Shed / Covered Yard' },
  { value: 'None', label: 'No storage (Immediate sale needed)' },
]

const STATE_OPTIONS: SelectOption[] = [
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Rajasthan', label: 'Rajasthan' },
]

export default function CreateCropLotPage() {
  const navigate = useNavigate()
  const toast = useToast()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    crop_name: 'Wheat',
    variety: 'Lok-1',
    quantity_quintal: 100,
    state: 'Maharashtra',
    district: 'Nashik',
    location: 'Nashik APMC Catchment',
    storage_type: 'Warehouse',
    storage_capacity_days: 30,
    harvest_date: new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.crop_name) errs.crop_name = 'Crop name is required'
      if (!formData.quantity_quintal || formData.quantity_quintal <= 0) {
        errs.quantity_quintal = 'Valid quantity is required'
      }
    } else if (currentStep === 2) {
      if (!formData.district) errs.district = 'District is required'
      if (!formData.location) errs.location = 'Village/location is required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev + 1) as 2 | 3)
    }
  }

  const handleBack = () => {
    setStep((prev) => (prev - 1) as 1 | 2)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return

    setSubmitting(true)
    try {
      const lot = await createCropLot({
        ...formData,
        quantity_quintal: Number(formData.quantity_quintal),
        storage_capacity_days: Number(formData.storage_capacity_days),
      })

      if (selectedFile) {
        try {
          await uploadCropImage(lot.id, selectedFile)
        } catch {
          // Non-blocking for mock/demo
        }
      }

      toast.success('Crop lot created!', `${lot.crop_name} (${lot.quantity_quintal}q) is registered.`)
      navigate(`/crop-lots/${lot.id}`)
    } catch (err: any) {
      toast.error('Failed to create crop lot', err?.message || 'Please check your inputs.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, marginBottom: '0.5rem' }}
          onClick={() => navigate('/crop-lots')}
        >
          <ArrowLeft size={16} /> Back to Crop Lots
        </button>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, margin: 0 }}>
          Create New Crop Lot
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Register your harvest to unlock AI market forecasts, sell/wait advice, and direct buyer offers.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        background: 'var(--color-surface-800)',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        {[
          { num: 1, label: 'Crop Details' },
          { num: 2, label: 'Location & Storage' },
          { num: 3, label: 'Quality & Review' },
        ].map((s) => {
          const isDone = step > s.num
          const isActive = step === s.num
          return (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                opacity: isActive || isDone ? 1 : 0.45,
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: isDone
                  ? 'var(--color-primary-600)'
                  : isActive
                  ? 'var(--color-primary-500)'
                  : 'var(--color-surface-600)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {isDone ? <Check size={14} /> : s.num}
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Main Form Box */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* STEP 1: Crop Details */}
          {step === 1 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <Wheat size={20} color="#4ade80" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Crop & Quantity</h3>
              </div>

              <Select
                label="Crop Type"
                required
                options={CROP_OPTIONS}
                value={formData.crop_name}
                error={errors.crop_name}
                onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
              />

              <Input
                label="Variety / Hybrid (Optional)"
                placeholder="e.g. Lok-1, Sharbati, HD-2967"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                helper="Variety helps matching with food processors."
              />

              <Input
                label="Quantity (in Quintals)"
                type="number"
                required
                min={1}
                step={0.5}
                placeholder="100"
                value={formData.quantity_quintal}
                error={errors.quantity_quintal}
                onChange={(e) => setFormData({ ...formData, quantity_quintal: Number(e.target.value) })}
                helper="1 Quintal = 100 Kilograms"
              />
            </div>
          )}

          {/* STEP 2: Location & Storage */}
          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <MapPin size={20} color="#4ade80" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Location & Storage Conditions</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Select
                  label="State"
                  required
                  options={STATE_OPTIONS}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
                <Input
                  label="District"
                  required
                  placeholder="e.g. Nashik"
                  value={formData.district}
                  error={errors.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>

              <Input
                label="Village / Mandi Catchment"
                required
                placeholder="e.g. Nashik APMC / Niphad"
                value={formData.location}
                error={errors.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Select
                  label="Storage Type"
                  options={STORAGE_OPTIONS}
                  value={formData.storage_type}
                  onChange={(e) => setFormData({ ...formData, storage_type: e.target.value })}
                />
                <Input
                  label="Storage Safe Capacity (Days)"
                  type="number"
                  min={0}
                  max={365}
                  value={formData.storage_capacity_days}
                  onChange={(e) => setFormData({ ...formData, storage_capacity_days: Number(e.target.value) })}
                  helper="Used by AI to calculate optimal holding time."
                />
              </div>
            </div>
          )}

          {/* STEP 3: Quality & AI Grading */}
          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <Sparkles size={20} color="#fbbf24" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Quality Grading & Review</h3>
              </div>

              <Input
                label="Harvest Date"
                type="date"
                iconLeft={<Calendar size={16} />}
                value={formData.harvest_date}
                onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
              />

              {/* Photo Upload Box */}
              <div className="form-group">
                <label className="form-label">Crop Sample Photo (For AI Grading)</label>
                <div style={{
                  border: '2px dashed var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'var(--color-surface-700)',
                  cursor: 'pointer',
                  position: 'relative',
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                  {imagePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={imagePreview}
                        alt="Crop Sample"
                        style={{ width: 140, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>
                        Sample photo uploaded! Click to change.
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <UploadCloud size={32} color="#94a3b8" />
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Click to upload grain photo</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        AI will assess grain luster, moisture estimate, and assign Grade A/B/C.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Review Card */}
              <div style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}>
                <div style={{ fontWeight: 700, color: '#4ade80' }}>Lot Summary:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Crop & Variety:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{formData.crop_name} ({formData.variety || 'Standard'})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Quantity:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{formData.quantity_quintal} Quintals</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Location:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{formData.district}, {formData.state}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Storage:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{formData.storage_type} ({formData.storage_capacity_days} days safe)</strong>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '0.75rem' }}>
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </Button>
            ) : <div />}

            {step < 3 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="submit" variant="primary" loading={submitting}>
                <CheckCircle2 size={16} /> Save & Generate Forecast
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
