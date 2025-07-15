type EntryProps = {
  name: string,
  score: number
}

function Entry({name, score}: EntryProps) {
  return (
    <div>
      <p>{name} {score}</p>
    </div>
  )
}

export default Entry
