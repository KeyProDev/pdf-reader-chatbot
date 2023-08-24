import Context from '@/context/context';
import {
    PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
    ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import { useContext, useEffect, useRef, useState } from 'react';

export default () => {
    const myElementRef = useRef<PdfViewerComponent>(null);

    const [pdfreader, setPdfreader] = useState<any>();

    const { fileUri } = useContext(Context);

    useEffect(() => {
        const reader = myElementRef.current;
        setPdfreader(reader);
    }, [])

    useEffect(() => {
        if (pdfreader) pdfreader.load(fileUri)
    }, [fileUri])

    return (
        <PdfViewerComponent
            id="container"
            ref={myElementRef}
            documentPath=""
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer"
            style={{ 'height': '100vh' }}>

            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner]} />

        </PdfViewerComponent>
    );
}