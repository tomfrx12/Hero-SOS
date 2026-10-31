import { Editor } from "@tinymce/tinymce-react"

interface EditeurRicheProps {
    value: string
    onChange: (contenu: string) => void
    hauteur?: number
}

export default function EditeurRiche({ value, onChange, hauteur = 500 }: EditeurRicheProps) {
    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={value}
            onEditorChange={onChange}
            init={{
                license_key: "gpl",
                height: hauteur,
                menubar: false,
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap",
                    "searchreplace", "visualblocks", "code", "fullscreen",
                    "insertdatetime", "media", "table", "wordcount",
                ],
                toolbar:
                    "undo redo | blocks | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist | link image | blockquote | removeformat | code fullscreen",
                skin: "oxide-dark",
                content_css: "dark",
                content_style:
                    "body { font-family: 'Instrument Sans', sans-serif; font-size: 16px; background: #18181B; color: #E4E4E7; padding: 16px; }",
            }}
        />
    )
}
