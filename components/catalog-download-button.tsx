'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CatalogDownloadDialog } from './catalog-download-dialog';

interface CatalogDownloadButtonProps
  extends React.ComponentProps<typeof Button> {
  catalogId: string;
  catalogName: string;
}

export function CatalogDownloadButton({
  catalogId,
  catalogName,
  ...props
}: CatalogDownloadButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} {...props}>
        Descargar el catálogo →
      </Button>
      <CatalogDownloadDialog
        catalogId={catalogId}
        catalogName={catalogName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
