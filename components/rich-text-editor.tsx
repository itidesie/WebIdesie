"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Escribe el contenido aquí...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const isInitialized = useRef(false)

  // Initialize content once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = content || ""
      isInitialized.current = true
    }
  }, [content])

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    triggerChange()
  }

  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    triggerChange()
  }

  const insertHeading = (level: number) => {
    exec("formatBlock", `h${level}`)
  }

  const addImage = () => {
    if (imageUrl) {
      exec("insertHTML", `<img src="${imageUrl}" alt="imagen" style="max-width:100%;height:auto;" />`)
      setImageUrl("")
      setIsImageDialogOpen(false)
    }
  }

  const addLink = () => {
    if (linkUrl) {
      exec("createLink", linkUrl)
      setLinkUrl("")
      setIsLinkDialogOpen(false)
    }
  }

  const MenuButton = ({
    onClick,
    children,
    title,
  }: {
    onClick: () => void
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className="admin-toolbar-button h-8 w-8 flex items-center justify-center"
    >
      {children}
    </button>
  )

  return (
    <div className="border border-[#262626] rounded-lg overflow-hidden bg-[#111111]">
      {/* Toolbar */}
      <div className="admin-toolbar flex flex-wrap gap-1 p-2 border-b border-[#262626]">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r border-[#262626]">
          <MenuButton onClick={() => exec("bold")} title="Negrita">
            <Bold className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("italic")} title="Cursiva">
            <Italic className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("underline")} title="Subrayado">
            <UnderlineIcon className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("strikeThrough")} title="Tachado">
            <Strikethrough className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("formatBlock", "pre")} title="Código">
            <Code className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 pr-2 border-r border-[#262626]">
          <MenuButton onClick={() => insertHeading(1)} title="Título 1">
            <Heading1 className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => insertHeading(2)} title="Título 2">
            <Heading2 className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => insertHeading(3)} title="Título 3">
            <Heading3 className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r border-[#262626]">
          <MenuButton onClick={() => exec("insertUnorderedList")} title="Lista con viñetas">
            <List className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("insertOrderedList")} title="Lista numerada">
            <ListOrdered className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("formatBlock", "blockquote")} title="Cita">
            <Quote className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 pr-2 border-r border-[#262626]">
          <MenuButton onClick={() => exec("justifyLeft")} title="Alinear izquierda">
            <AlignLeft className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("justifyCenter")} title="Alinear centro">
            <AlignCenter className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("justifyRight")} title="Alinear derecha">
            <AlignRight className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("justifyFull")} title="Justificar">
            <AlignJustify className="h-4 w-4" />
          </MenuButton>
        </div>

        {/* Media & Links */}
        <div className="flex gap-1 pr-2 border-r border-[#262626]">
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="admin-toolbar-button h-8 w-8 flex items-center justify-center"
                title="Insertar imagen"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-[#262626]">
              <DialogHeader>
                <DialogTitle className="text-[#ededed]">Insertar Imagen</DialogTitle>
                <DialogDescription className="text-[#a1a1a1]">
                  Ingresa la URL de la imagen que deseas insertar
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url" className="text-[#ededed]">URL de la imagen</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="admin-input mt-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)} className="admin-button-secondary">
                  Cancelar
                </Button>
                <Button type="button" onClick={addImage} className="admin-button-primary">
                  Insertar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="admin-toolbar-button h-8 w-8 flex items-center justify-center"
                title="Insertar enlace"
              >
                <Link2 className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#111111] border-[#262626]">
              <DialogHeader>
                <DialogTitle className="text-[#ededed]">Insertar Enlace</DialogTitle>
                <DialogDescription className="text-[#a1a1a1]">Ingresa la URL del enlace</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-url" className="text-[#ededed]">URL del enlace</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    className="admin-input mt-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)} className="admin-button-secondary">
                  Cancelar
                </Button>
                <Button type="button" onClick={addLink} className="admin-button-primary">
                  Insertar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* History */}
        <div className="flex gap-1">
          <MenuButton onClick={() => exec("undo")} title="Deshacer">
            <Undo className="h-4 w-4" />
          </MenuButton>
          <MenuButton onClick={() => exec("redo")} title="Rehacer">
            <Redo className="h-4 w-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="prose prose-sm prose-invert max-w-none min-h-[400px] p-4 text-[#ededed] focus:outline-none"
          style={{ wordBreak: "break-word" }}
        />
        {/* Placeholder */}
        {!content && (
          <div
            className="absolute top-4 left-4 text-[#525252] pointer-events-none select-none"
            style={{ display: editorRef.current?.innerHTML ? "none" : "block" }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}
