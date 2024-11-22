document.getElementById('kimiBtn').addEventListener('click', function() {
    const userInput = document.getElementById('kimiInput').value.trim();
    if (!userInput) {
        alert('请输入要分析的内容');
        return;
    }
    
    const prefix = ' 仔细阅读这个链接中的内容。\n接下来，扮演一名知识整理专家，把我提供的知识文章整理成知识和案例卡片。\n## 背景信息\n目标读者均为该领域的小白新手，你在把文章中内容整理成卡片文字时，**务必确保表达方式通俗易懂**，**务必保留文章中的金句**。\n## 整理要求\n- 使用金字塔原理对知识文章进行提炼概括，如果原文不是金字塔结构则进行重构\n- 确保文章中的关键信息都被整理到知识卡片中\n- 确保每张卡片中各段信息之间、卡片知识与卡片知识之间具备连贯性\n- 对知识点进行展开介绍时，确保信息的通俗易懂，避免使用专业术语\n- 输出纯文本内容，不要包含任何标识符。\n## 输出结构\n将信息以 JSON 格式输出。\n参考如下结构\n{"CoverCard": {"title": "整组卡片的标题，优先使用疑问句，简洁具有吸引力"},"detailCards": [{"title": "第一张卡片的标题，","knowledgePoints": {"point1": "第一个知识点的小标题，20字以内","point1_desc":"第一个知识点的展开介绍，不超过100字","point2": "第二个知识点的小标题，20字以内","point2_desc":"第二个知识点的展开介绍，不超过100字","point3": "第三个知识点的小标题，20字以内","point3_desc":"第三个知识点的展开介绍，不超过100字"}},{"title": "第二张卡片的标题，","knowledgePoints": {"point1": "第一个知识点的小标题，20字以内","point1_desc":"第一个知识点的展开介绍，不超过100字","point2": "第二个知识点的小标题，20字以内","point2_desc":"第二个知识点的展开介绍，不超过100字","point3": "第三个知识点的小标题，20字以内","point3_desc":"第三个知识点的展开介绍，不超过100字"}}]}';
    const fullPrompt = encodeURIComponent(userInput + prefix);
    const kimiUrl = `https://kimi.moonshot.cn/_prefill_chat?prefill_prompt=${fullPrompt}&send_immediately=true&force_search=true`;
    
    window.open(kimiUrl, '_blank');
});

document.getElementById('convertBtn').addEventListener('click', function() {
    const jsonInput = document.getElementById('jsonInput').value;
    try {
        const jsonData = JSON.parse(jsonInput);
        renderCards(jsonData);
    } catch (e) {
        alert('Please enter a valid JSON structure.');
    }
});
document.getElementById('generatePicBtn').addEventListener('click', function() {
    const cards = document.querySelectorAll('.card');
    const promises = [];
    const canvases = []; // 本地变量，避免全局污染
    
    cards.forEach((card, index) => {
        const promise = html2canvas(card, {
                width: 300,
                height: 400,
                scale: 4
            })
            .then(canvas => {
                const wrapper = document.createElement('div');
                wrapper.className = 'card-image-wrapper';
                wrapper.appendChild(canvas);
                canvases.push(canvas);
                document.getElementById('pictureArea').appendChild(wrapper);
            })
            .catch(error => {
                console.error('Failed to render card:', error);
            });
        promises.push(promise);
    });
    
    // Promise.all(promises).then(() => {
    //     // 所有卡片渲染完成后添加下载按钮
    //     const downloadAllBtn = document.createElement('button');
    //     downloadAllBtn.className = 'download-all-btn';
    //     downloadAllBtn.innerHTML = 'Download All';
    //     document.body.appendChild(downloadAllBtn);
        
    //     downloadAllBtn.addEventListener('click', function() {
    //         canvases.forEach((canvas, index) => {
    //             const blob = new Blob([canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "")], {type: "image/png"});
    //             saveAs(blob, `card-${index}.png`);
    //         });
    //     });
    // });
});

function renderCards(data) {
    const previewArea = document.getElementById('previewArea');
    previewArea.innerHTML = ''; // Clear previous cards

    // Render Cover Card
    if (data.CoverCard) {
        const coverCard = createCard(data.CoverCard, 'cover-card');
        previewArea.appendChild(coverCard);
    }

    // Render Introduction Card
    if (data.introduction) {        
        const introCard = createCard(data.introduction, 'introduction-card');
        previewArea.appendChild(introCard);
    }

    // Render Detail Cards
    if (data.detailCards) {
        data.detailCards.forEach((cardData, index) => {
            const detailCard = createCard(cardData, 'detail-card');
            previewArea.appendChild(detailCard);
        });
    }
    
}

function createCard(data, cardType) {
    const card = document.createElement('div');
    card.className = `card ${cardType}`;
    if (cardType === 'cover-card') {
        card.innerHTML = `
            <div class="cover-card-content">
                <div class="card-title">${data.title}</div>
            </div>
            <div class="cover-card-bg">
                <img src="./assets/img/thumb1/cover-card.png">
            </div>
        `;
    } else if (cardType === 'introduction-card') {
        card.innerHTML = `
            <div class="card-det-title">${data.title}</div>
            <div class="textbox bg-black-500 p-2 textbox-intro">${data.introduction}</div>
        `;
    } else if (cardType === 'detail-card') {
        card.innerHTML = `
            <div class="detail-card-content">
                <div class="card-title">${data.title}</div>
                <div class="card-item">
                    <div class="card-subtitle">${data.knowledgePoints.point1}</div>
                    <div class="card-subcontent">${data.knowledgePoints.point1_desc}</div>
                </div>
                <div class="card-item">
                    <div class="card-subtitle">${data.knowledgePoints.point2}</div>
                    <div class="card-subcontent">${data.knowledgePoints.point2_desc}</div>
                </div>
                <div class="card-item">
                    <div class="card-subtitle">${data.knowledgePoints.point3}</div>
                    <div class="card-subcontent">${data.knowledgePoints.point3_desc}</div>
                </div>
            </div>
            <div class="detail-card-bg">
                <img src="./assets/img/thumb1/detail-card.png">
            </div>
            <!-- Repeat for each knowledge point -->
        `;
        for (let point in data.knowledgePoints) {
            const pointDiv = document.createElement('div');
            pointDiv.className = 'textbox bg-black-500 p-2 textbox-content';
            pointDiv.textContent = data.knowledgePoints[point];
            card.appendChild(pointDiv);
        }
    }
    return card;

}