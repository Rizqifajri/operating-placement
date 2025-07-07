import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface CardDetailModalProps {
  data: {
    source: string
    division: string
    brand: string
    category: string
    quarter: string
    platform: string
    sow: string
    content: string
    link: string
    status: string
    date: string
  } | null
  onClose: () => void
}

export const CardDetailModal = ({ data, onClose }: CardDetailModalProps) => {
  if (!data) return null

  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Detail Campaign
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Informasi lengkap dari data campaign yang dipilih
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6 text-sm text-gray-800">
          <DetailItem label="Source" value={data.source} />
          <DetailItem label="Division" value={data.division} />
          <DetailItem label="Brand" value={data.brand} />
          <DetailItem label="Category" value={data.category} />
          <DetailItem label="Quarter" value={data.quarter} />
          <DetailItem label="Platform" value={data.platform} />
          <DetailItem label="Status" value={data.status} />
          <DetailItem label="Date" value={data.date} />

          <div className="col-span-2 border-t pt-4">
            <DetailItem label="SOW" value={data.sow} multiline />
          </div>

          <div className="col-span-2">
            <DetailItem label="Content" value={data.content} multiline />
          </div>

          <div className="col-span-2">
            <div className="text-sm font-medium text-gray-600 mb-1">Link</div>
            {data.link ? (
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-words"
              >
                {data.link}
              </a>
            ) : (
              <p className="text-gray-500 italic">Tidak tersedia</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Komponen kecil untuk menampilkan label + value
const DetailItem = ({
  label,
  value,
  multiline = false,
}: {
  label: string
  value: string
  multiline?: boolean
}) => {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      {multiline ? (
        <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-gray-800 truncate">{value}</p>
      )}
    </div>
  )
}
