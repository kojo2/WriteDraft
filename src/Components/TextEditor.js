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

const TextEditor = () => {
  const { draftId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { drafts } = useRedux()
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
    </div>
  )
}

export default TextEditor
