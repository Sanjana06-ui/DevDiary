import { useParams } from 'react-router-dom'
import './EditEntry.css'

const EditEntry = () => {
  const { id } = useParams()

  return (
    <main className="edit-entry-page page-wrapper" id="edit-entry-page">
      {/* EditEntry page – to be designed */}
      <h1>Edit Entry Page (ID: {id})</h1>
    </main>
  )
}

export default EditEntry
