import { useParams } from "react-router"

export default function AdminIncident() {
    const { id } = useParams()

    return (
        <h1>Incident n°{id}</h1>
    )
}
