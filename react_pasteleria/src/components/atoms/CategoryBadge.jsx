import { Badge } from 'react-bootstrap'

function CategoryBadge({ categoria }) {
  if (!categoria) return null
  return <Badge className="badge-categoria">{categoria}</Badge>
}

export default CategoryBadge
