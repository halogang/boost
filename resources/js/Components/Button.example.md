# Button Component - Reusable dengan Primary Color

Komponen Button yang reusable dengan support untuk primary color dari system settings dan dark mode.

## Import

```typescript
import { Button } from '@/Components/Button';
// atau
import Button from '@/Components/Button';
```

## Variants

### Default (Primary)
Menggunakan primary color dari system settings.

```tsx
<Button>Tambah Data</Button>
<Button variant="default">Simpan</Button>
```

### Secondary
Button dengan style secondary.

```tsx
<Button variant="secondary">Batal</Button>
```

### Outline
Button dengan border outline.

```tsx
<Button variant="outline">Export</Button>
```

### Ghost
Button tanpa background, hanya hover effect.

```tsx
<Button variant="ghost">Detail</Button>
```

### Destructive
Button untuk action yang berbahaya (hapus, dll).

```tsx
<Button variant="destructive">Hapus</Button>
```

### Link
Button yang terlihat seperti link.

```tsx
<Button variant="link">Lihat Semua</Button>
```

## Sizes

### Small
```tsx
<Button size="sm">Small Button</Button>
```

### Default
```tsx
<Button>Default Button</Button>
<Button size="default">Default Button</Button>
```

### Large
```tsx
<Button size="lg">Large Button</Button>
```

### Icon Only
```tsx
<Button size="icon">
  <Plus className="h-5 w-5" />
</Button>
```

## Loading State

```tsx
<Button isLoading={isSubmitting}>
  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
</Button>
```

## Dengan Icon

```tsx
import { Plus, Download, Trash2 } from 'lucide-react';

<Button>
  <Plus className="w-5 h-5 mr-2" />
  Tambah Data
</Button>

<Button variant="outline">
  <Download className="w-5 h-5 mr-2" />
  Export
</Button>

<Button variant="destructive">
  <Trash2 className="w-5 h-5 mr-2" />
  Hapus
</Button>
```

## Sebagai Link (dengan Inertia)

```tsx
import { Link } from '@inertiajs/react';

<Link href="/users/create">
  <Button>Tambah User</Button>
</Link>
```

## Custom Styling

```tsx
<Button className="w-full">Full Width</Button>
<Button className="mt-4">With Margin</Button>
```

## Full Example

```tsx
import { Button } from '@/Components/Button';
import { Link } from '@inertiajs/react';
import { Plus, Save, X } from 'lucide-react';

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {/* Primary Button */}
      <Link href="/create">
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Tambah Data
        </Button>
      </Link>

      {/* Button dengan Loading */}
      <Button 
        isLoading={isLoading}
        onClick={() => {
          setIsLoading(true);
          // ... handle submit
        }}
      >
        Simpan
      </Button>

      {/* Secondary Button */}
      <Button variant="secondary">Batal</Button>

      {/* Outline Button */}
      <Button variant="outline">Export</Button>

      {/* Destructive Button */}
      <Button variant="destructive">
        <X className="w-5 h-5 mr-2" />
        Hapus
      </Button>

      {/* Small Button */}
      <Button size="sm">Kecil</Button>

      {/* Large Button */}
      <Button size="lg">Besar</Button>
    </div>
  );
}
```

## Fitur

✅ Menggunakan primary color dari system settings
✅ Support dark mode
✅ Multiple variants (default, secondary, outline, ghost, destructive, link)
✅ Multiple sizes (sm, default, lg, icon)
✅ Loading state dengan spinner
✅ Disabled state
✅ Focus ring menggunakan primary color
✅ Fully typed dengan TypeScript
✅ Support semua HTML button attributes

