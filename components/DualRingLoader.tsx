import React from 'react'

const DualRingLoader = ({ text = ' ', size = 'medium', color = 'black' }) => (
  <>
    <style jsx>{`
      aside {
        display: grid;
        place-self: center;
        place-items: center;
        flex: 1 1 100%;
        padding: 1rem;
        width: 100%;
        height: 100%;
      }
      .text {
        margin: auto;
        width: 100%;
        max-width: 800px;
        text-align: center;
      }
      .lds-dual-ring {
        position: relative;
        display: inline-block;
      }
      .lds-dual-ring:after {
        --base-color: ${color};
        content: ' ';
        display: block;
        width: ${size !== 'tiny' ? '2.69rem' : '.89rem'};
        height: ${size !== 'tiny' ? '2.69rem' : '.89rem'};
        margin: auto;
        border-radius: 50%;
        border: ${size !== 'tiny' ? '6px' : '1px'} solid
          var(--base-color, black);
        border-color: var(--base-color, black) transparent
          var(--base-color, black) transparent;
        animation: lds-dual-ring 1.2s linear infinite;
      }
      @keyframes lds-dual-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
    <aside>
      <div className="lds-dual-ring" />
      <p className="text">{text}</p>
    </aside>
  </>
)

export default DualRingLoader
