import { Button } from '../../components/ui/button'

export default function AdminSettings() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium">Site Name</label>
          <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" defaultValue="RealEstate" />
        </div>
        <div>
          <label className="text-sm font-medium">Contact Email</label>
          <input className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" defaultValue="admin@realesate.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Currency</label>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
            <option>USD</option>
            <option>INR</option>
            <option>EUR</option>
          </select>
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  )
}
