import { useContext, useEffect, useRef, useState } from 'react';
import { DocumentEditorContainerComponent, DocumentEditorComponent, Toolbar, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog } from '@syncfusion/ej2-react-documenteditor';
DocumentEditorContainerComponent.Inject(Toolbar, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog);
import axios from 'axios';
import Context from '@/context/context';
let container: DocumentEditorContainerComponent;

export default () => {
    const myElementRef = useRef<DocumentEditorComponent>(null);

    const { fileUri, file } = useContext(Context);

    useEffect(() => {
        if (file) {
            let ajax: XMLHttpRequest = new XMLHttpRequest();
            ajax.open('POST', 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/Import', true);
            ajax.onreadystatechange = () => {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200 || ajax.status === 304) {
                        //Open SFDT text in Document Editor
                        container.documentEditor.open(ajax.responseText);
                    }
                }
            }
            let formData: FormData = new FormData();
            formData.append('files', file);
            ajax.send(formData);
        }
    }, [file])

    return (

        <DocumentEditorContainerComponent
            id="container"
            ref={(scope) => { container = scope; }}
            height={'100vh'}
            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
            enableToolbar={true}

        />
    );
}