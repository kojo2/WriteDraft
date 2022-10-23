import React, { useEffect, useState } from 'react'
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useNavigate, useParams } from 'react-router-dom'
import useInterval from 'use-interval'
import { useDispatch } from 'react-redux'
import { updateDrafts } from '../redux/mainActions'
import useRedux from '../redux/useRedux'
import { getLevelCards } from '../utils/functions'

const TextEditor = () => {
  const { draftId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { drafts, cards: allCards } = useRedux()
  const [justSaved, setJustSaved] = useState(false)
  const [editorState, setEditorState] = React.useState(() => {
    let d = drafts.find((x) => x.index === parseInt(draftId))
    if (d) {
      return EditorState.createWithContent(ContentState.createFromText(d.text))
    } else {
      return EditorState.createEmpty()
    }
  })

  const saveChanges = () => {
    let _drafts = [...drafts]
    _drafts.find(
      (x) => x.index === parseInt(draftId),
    ).text = editorState.getCurrentContent().getPlainText()
    dispatch(updateDrafts([..._drafts]))
    setJustSaved(true)
    setTimeout(() => {
      setJustSaved(false)
    }, 1000)
  }

  const draft = drafts.find((x) => x.index === parseInt(draftId)) || {
    cards: [],
  }

  const getCardDetails = (cards) =>
    cards.map((c) => {
      if (!c.words) {
        c.words = draft.averageWordCount
      }
      delete c.children
      delete c.x
      delete c.y
      return { ...c }
    })

  useInterval(() => {
    saveChanges()
  }, [60000])

  return (
    <div
      className="text-editor-container"
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key === 's') {
          saveChanges()
        }
        if (e.key === 'Escape') {
          navigate(-1)
        }
      }}
    >
      {justSaved ? <span className="word-count">Saved</span> : null}
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        placeholder="some text..."
      />
      <ul className="text-editor-card-summaries">
        {getCardDetails(getLevelCards(allCards, draft.route)).map((c) => (
          <li>
            {c.text} ({c.words} words)
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TextEditor
