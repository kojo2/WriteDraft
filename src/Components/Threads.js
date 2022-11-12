import { times } from 'lodash'
import { useState } from 'react'

const Threads = () => {
  const [thread, setThread] = useState([
    'Something goes wrong',
    'And then everything changes',
    'Bill falls in the well',
    'Karen informs the police',
  ])
  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'n') {
          let t = window.prompt('')
          if (t.length) {
            let _thread = [...thread]
            _thread.push(t)
            setThread(_thread)
          }
        }
      }}
    >
      <div className="threads-container">
        <div className="title-bar" style={{ marginTop: '-30px' }}>
          {'Dogz is awesome'}
        </div>
        <div className="threads-inner-container">
          <div className="threads-vert-line-container">
            <div className="threads-vert-line" />
            <div className="threads-hline-container">
              {thread.map((x, i) => {
                let even = i % 2 === 0
                if (even) {
                  return (
                    <>
                      <div
                        className=""
                        style={{
                          top: i * 50,
                          position: 'absolute',
                          left: '0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            className="threads-horiz-line"
                            style={{
                              marginRight: '10px',
                            }}
                          />
                          <div style={{ whiteSpace: 'nowrap' }}>{x}</div>
                        </div>
                      </div>
                    </>
                  )
                } else {
                  return (
                    <>
                      <div
                        className=""
                        style={{
                          top: i * 50,
                          position: 'absolute',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            right: '-10px',
                            position: 'absolute',
                          }}
                        >
                          <div
                            style={{
                              marginRight: '10px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {x}
                          </div>
                          <div
                            className="threads-horiz-line"
                            style={{
                              marginRight: '10px',
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Threads
