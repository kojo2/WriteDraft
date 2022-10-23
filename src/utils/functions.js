export const getLevelCards = (_cards, f) => {
  if (f) {
    let r = f.split('-').filter((x) => x)
    let p = { c: _cards }
    r.forEach((index) => {
      let i = parseInt(index)
      p = { c: p.c.find((x) => x.index === i)?.children || [] }
    })
    return p.c
  }
  return _cards
}
