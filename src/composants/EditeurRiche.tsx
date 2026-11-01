import { Editor } from "@tinymce/tinymce-react"

import "tinymce/tinymce"
import "tinymce/icons/default/icons"
import "tinymce/themes/silver/theme"
import "tinymce/models/dom/model"
import "tinymce/plugins/advlist/plugin"
import "tinymce/plugins/autolink/plugin"
import "tinymce/plugins/lists/plugin"
import "tinymce/plugins/link/plugin"
import "tinymce/plugins/image/plugin"
import "tinymce/plugins/charmap/plugin"
import "tinymce/plugins/searchreplace/plugin"
import "tinymce/plugins/visualblocks/plugin"
import "tinymce/plugins/code/plugin"
import "tinymce/plugins/fullscreen/plugin"
import "tinymce/plugins/insertdatetime/plugin"
import "tinymce/plugins/media/plugin"
import "tinymce/plugins/table/plugin"
import "tinymce/plugins/wordcount/plugin"

import "tinymce/skins/ui/oxide-dark/skin.css"

interface EditeurRicheProps {
    value: string
    onChange: (contenu: string) => void
    hauteur?: number
}

export default function EditeurRiche({ value, onChange, hauteur = 500 }: EditeurRicheProps) {
    return (
        <Editor
            licenseKey="gpl"
            value={value}
            onEditorChange={onChange}
            init={{
                height: hauteur,
                menubar: false,
                skin: false,
                content_css: false,
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap",
                    "searchreplace", "visualblocks", "code", "fullscreen",
                    "insertdatetime", "media", "table", "wordcount",
                ],
                toolbar:
                    "undo redo | blocks | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist | link image | blockquote | removeformat | code fullscreen",
                content_style:
                    "body { font-family: 'Instrument Sans', sans-serif; font-size: 16px; background: #18181B; color: #E4E4E7; padding: 16px; }",
            }}
        />
    )
}
