import React, {FC, useState, useContext} from 'react'

// Components
import {
  DraggableResizer,
  FlexBox,
  FlexDirection,
  Orientation,
  Button,
  IconFont,
  AlignItems,
  JustifyContent,
  Overlay,
  ComponentStatus,
} from '@influxdata/clockface'
import {QueryProvider} from 'src/shared/contexts/query'
import {EditorProvider} from 'src/shared/contexts/editor'
import {ResultsProvider} from 'src/dataExplorer/components/ResultsContext'
import {SidebarProvider} from 'src/dataExplorer/context/sidebar'
import {
  PersistanceProvider,
  PersistanceContext,
} from 'src/dataExplorer/context/persistance'
import {RESOURCES} from 'src/dataExplorer/components/resources'
import ResultsPane from 'src/dataExplorer/components/ResultsPane'
import Sidebar from 'src/dataExplorer/components/Sidebar'
import Schema from 'src/dataExplorer/components/Schema'
import SaveAsScript from 'src/dataExplorer/components/SaveAsScript'

// Styles
import './FluxQueryBuilder.scss'
import {isFlagEnabled} from 'src/shared/utils/featureFlag'

export enum OverlayType {
  NEW = 'new',
  SAVE = 'save',
}

const FluxQueryBuilder: FC = () => {
  const {query, resource, save, vertical, setVertical} = useContext(
    PersistanceContext
  )
  const [overlayType, setOverlayType] = useState<OverlayType | null>(null)

  const handleSave = () => {
    if (RESOURCES[resource.type].editor) {
      setOverlayType(OverlayType.SAVE)
    } else {
      save()
    }
  }

  return (
    <EditorProvider>
      <SidebarProvider>
        <Overlay visible={overlayType !== null}>
          <SaveAsScript
            type={overlayType}
            onClose={() => setOverlayType(null)}
          />
        </Overlay>
        <FlexBox
          className="flux-query-builder--container"
          direction={FlexDirection.Column}
          justifyContent={JustifyContent.SpaceBetween}
          alignItems={AlignItems.Stretch}
        >
          <div
            className="flux-query-builder--menu"
            data-testid="flux-query-builder--menu"
          >
            <Button
              onClick={() => setOverlayType(OverlayType.NEW)}
              text="New Script"
              icon={IconFont.Plus_New}
              status={
                query.length === 0
                  ? ComponentStatus.Disabled
                  : ComponentStatus.Default
              }
            />
            {isFlagEnabled('saveAsScript') && (
              <Button
                className="flux-query-builder__save-button"
                onClick={handleSave}
                text={`Save ${
                  resource?.type
                    ? resource.type.charAt(0).toUpperCase() +
                      resource.type.slice(1, resource.type.length - 1)
                    : 'Script'
                }`}
                icon={IconFont.Save}
              />
            )}
          </div>
          <DraggableResizer
            handleOrientation={Orientation.Vertical}
            handlePositions={vertical}
            onChangePositions={setVertical}
          >
            <DraggableResizer.Panel>
              <Schema />
            </DraggableResizer.Panel>
            <DraggableResizer.Panel
              testID="flux-query-builder-middle-panel"
              className="new-data-explorer-rightside"
            >
              <ResultsPane />
            </DraggableResizer.Panel>
            <DraggableResizer.Panel>
              <Sidebar />
            </DraggableResizer.Panel>
          </DraggableResizer>
        </FlexBox>
      </SidebarProvider>
    </EditorProvider>
  )
}

export default () => (
  <QueryProvider>
    <ResultsProvider>
      <PersistanceProvider>
        <FluxQueryBuilder />
      </PersistanceProvider>
    </ResultsProvider>
  </QueryProvider>
)
