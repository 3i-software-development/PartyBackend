var tool = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
    },
    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4, 5],
            defaultLevel: 2,
        },
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: ImageTool,
        config: {
            uploader: {
                uploadByFile(file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "https://api.imgbb.com/1/upload?key=eda14a1df48578ed2d88d645929b137c", // Thay YOUR_API_KEY bằng API key của bạn
                            method: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {
                                resolve({ success: 1, file: { url: response.data.url } });
                            },
                            error: function (xhr, status, error) {
                                console.error('Error uploading image:', error);
                                reject(error);
                            }
                        });
                    });
                },
            },
        },
    },
    embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
            services: {
                youtube: true,
            },
            render: (url) => {
                return `<video src="${url}" controls></video>`;
            },
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
        },
    },
    delimiter: {
        class: Delimiter,
    },
    warning: {
        class: Warning,
    },
    code: CodeTool,
    checklist: {
        class: Checklist,
    },
    nestedchecklist: editorjsNestedChecklist,
    table: Table,
}