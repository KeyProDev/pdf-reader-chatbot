import Context from '@/context/context';
import {
  PdfViewerComponent,
  Toolbar,
  Magnification,
  Navigation,
  LinkAnnotation,
  BookmarkView,
  ThumbnailView,
  Print,
  TextSelection,
  TextSearch,
  Annotation,
  FormFields,
  FormDesigner,
  Inject,
  ContextMenuItem,
} from '@syncfusion/ej2-react-pdfviewer';
import { useContext, useEffect, useRef, useState } from 'react';

export default () => {
  const myElementRef = useRef<PdfViewerComponent>(null);

  const [pdfreader, setPdfreader] = useState<any>();

  const { fileUri } = useContext(Context);

  useEffect(() => {
    const reader = myElementRef.current;
    if (reader) {
      reader.contextMenuSettings = {
        contextMenuAction: 'RightClick',
        contextMenuItems: [
          ContextMenuItem.Comment,
          ContextMenuItem.Copy,
          ContextMenuItem.Cut,
          ContextMenuItem.Delete,
          ContextMenuItem.Highlight,
          ContextMenuItem.Paste,
          ContextMenuItem.Properties,
          ContextMenuItem.ScaleRatio,
          ContextMenuItem.Strikethrough,
          ContextMenuItem.Underline,
        ],
      };
      setPdfreader(reader);
      if (fileUri) reader.load(fileUri);
    }
  }, []);

  useEffect(() => {
    if (pdfreader) pdfreader.load(fileUri);
  }, [fileUri]);

  return (
    <PdfViewerComponent
      id="container"
      ref={myElementRef}
      documentPath=""
      contextMenuSettings={{
        contextMenuAction: 'RightClick',
        contextMenuItems: [
          ContextMenuItem.Comment,
          ContextMenuItem.Copy,
          ContextMenuItem.Cut,
          ContextMenuItem.Delete,
          ContextMenuItem.Highlight,
          ContextMenuItem.Paste,
          ContextMenuItem.Properties,
          ContextMenuItem.ScaleRatio,
          ContextMenuItem.Strikethrough,
          ContextMenuItem.Underline,
        ],
      }}
      serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
      style={{ height: '100vh' }}
    >
      <Inject
        services={[
          Toolbar,
          Magnification,
          Navigation,
          Annotation,
          LinkAnnotation,
          BookmarkView,
          ThumbnailView,
          Print,
          TextSelection,
          TextSearch,
          FormFields,
          FormDesigner,
        ]}
      />
    </PdfViewerComponent>
  );
};
