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

const PDFEditor = () => {
  const myElementRef = useRef<PdfViewerComponent>(null);

  const [pdfreader, setPdfreader] = useState<any>();

  const { fileUri } = useContext(Context);

  // const extractTextCompleted = (args) => {
  //   // Extract the Complete text of load document
  //   console.log(args);
  //   console.log(args.documentTextCollection[1]);
  //   // Extract the Text data.
  //   console.log(args.documentTextCollection[1][1].TextData);
  //   // Extract Text in the Page.
  //   console.log(args.documentTextCollection[1][1].PageText);
  //   // Extract Text along with Bounds
  //   console.log(args.documentTextCollection[1][1].TextData[0].Bounds);
  // };

  useEffect(() => {
    const reader = myElementRef.current;
    if (reader) {
      // reader.contextMenuSettings = {
      //   contextMenuAction: 'RightClick',
      //   contextMenuItems: [
      //     ContextMenuItem.Comment,
      //     ContextMenuItem.Copy,
      //     ContextMenuItem.Cut,
      //     ContextMenuItem.Delete,
      //     ContextMenuItem.Highlight,
      //     ContextMenuItem.Paste,
      //     ContextMenuItem.Properties,
      //     ContextMenuItem.ScaleRatio,
      //     ContextMenuItem.Strikethrough,
      //     ContextMenuItem.Underline,
      //   ],
      // };
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
      // isExtractText={true}
      // extractTextCompleted={extractTextCompleted}
      // contextMenuSettings={{
      //   contextMenuAction: 'RightClick',
      //   contextMenuItems: [
      //     ContextMenuItem.Comment,
      //     ContextMenuItem.Copy,
      //     ContextMenuItem.Cut,
      //     ContextMenuItem.Delete,
      //     ContextMenuItem.Highlight,
      //     ContextMenuItem.Paste,
      //     ContextMenuItem.Properties,
      //     ContextMenuItem.ScaleRatio,
      //     ContextMenuItem.Strikethrough,
      //     ContextMenuItem.Underline,
      //   ],
      // }}
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

export default PDFEditor;
