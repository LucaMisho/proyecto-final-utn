import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const BARRA = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link"],
  ["clean"],
];

export default function CampoEnriquecido({ id, valor, alCambiar }) {
  return (
    <div id={id} className="admin-editor">
      <ReactQuill
        theme="snow"
        value={valor}
        modules={{ toolbar: BARRA }}
        onChange={(html, _delta, _fuente, editor) =>
          alCambiar(editor.getText().trim() === "" ? "" : html)
        }
      />
    </div>
  );
}