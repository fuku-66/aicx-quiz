// flashcard.js — 単語帳（フラッシュカード）

const FC_CHAPTERS = [
  { key: 'all',   label: 'すべて' },
  { key: 'Ch.01', label: 'Ch.01' },
  { key: 'Ch.02', label: 'Ch.02' },
  { key: 'Ch.03', label: 'Ch.03' },
  { key: 'Ch.04', label: 'Ch.04' },
  { key: 'Ch.05', label: 'Ch.05' },
  { key: 'Ch.06', label: 'Ch.06' },
];

const FC_TERMS = [
  {id:"1",term:"生成AI",reading:"セイセイエーアイ",meaning:"学習したデータをもとに、テキスト・画像・音声・コード等の新しい出力を生み出せるAI。Generative AIとも呼ばれ、予測や識別が主だった従来AIと区別される。",chapter:"Ch.01",fullName:"Generative AI"},
  {id:"2",term:"LLM",reading:"エルエルエム",meaning:"大量のテキストから言語パターンを学習し、文脈の次に来る最も自然な言葉を確率的に予測する大規模言語モデル。生成AIの中核技術。",chapter:"Ch.01",fullName:"Large Language Model"},
  {id:"3",term:"AGI",reading:"エージーアイ",meaning:"人間と同じようにあらゆる分野をこなせる汎用人工知能。現状の特化型AIに対する概念で、定義自体が研究者の間で一致していない。",chapter:"Ch.01",fullName:"Artificial General Intelligence"},
  {id:"4",term:"ASI",reading:"エーエスアイ",meaning:"あらゆる面で人間をはるかに超える知能。人工超知性とも訳され、AGIのさらに先の仮説的概念。",chapter:"Ch.01",fullName:"Artificial Superintelligence"},
  {id:"5",term:"ハルシネーション",reading:"",meaning:"AIが事実ではない情報をもっともらしく生成してしまう現象。言語モデルが確率的に最も自然な言葉を選ぶ構造的特性であり完全には排除できない。",chapter:"Ch.01",fullName:"Hallucination"},
  {id:"6",term:"トークン",reading:"",meaning:"LLMがテキストを処理する際の最小単位。日本語は1文字〜数文字で1トークン。API利用料はトークン数に応じた従量課金で、コスト見積りに必須。",chapter:"Ch.01",fullName:""},
  {id:"7",term:"コンテキストウィンドウ",reading:"",meaning:"LLMに一度に渡せるトークンの上限。現在の主要モデルでは大幅に拡大しているが、全文投入はコスト面で非効率でRAG等で必要部分を渡す設計が合理的。",chapter:"Ch.01",fullName:""},
  {id:"8",term:"機械学習",reading:"キカイガクシュウ",meaning:"大量データからパターンやルールを自動的に学習し予測や判断を行うAIの中核技術。教師あり学習・教師なし学習・強化学習に大別される。",chapter:"Ch.01",fullName:"Machine Learning"},
  {id:"9",term:"ディープラーニング",reading:"",meaning:"機械学習の一種で、ニューラルネットワークを多層化した手法。非構造化データから特徴量を自動抽出でき、LLM等の生成AIの基盤技術。",chapter:"Ch.01",fullName:"Deep Learning"},
  {id:"10",term:"非構造化データ",reading:"ヒコウゾウカデータ",meaning:"メール・議事録・文書・画像・音声など明確な構造を持たないデータ。企業データの約8割を占め、生成AIが真価を発揮する領域。",chapter:"Ch.01",fullName:""},
  {id:"11",term:"プロンプトエンジニアリング",reading:"",meaning:"LLMへの指示文(プロンプト)を工夫して望ましい出力を得る技術。後にコンテキストエンジニアリングへと概念が拡張された。",chapter:"Ch.01",fullName:"Prompt Engineering"},
  {id:"12",term:"AIエージェント",reading:"",meaning:"目標を与えると自律的に計画・判断・行動できるAIシステム。頭脳(LLM)・記憶(ナレッジベース)・手足(ツール連携)の三位一体で構成される。",chapter:"Ch.01",fullName:""},
  {id:"13",term:"三位一体モデル",reading:"サンミイッタイモデル",meaning:"AIエージェントを頭脳(LLM)・記憶(ナレッジベース)・手足(ツール連携)の3要素で捉えるフレームワーク。どれか1つ欠けると機能しない。",chapter:"Ch.01",fullName:""},
  {id:"14",term:"ナレッジベース",reading:"",meaning:"業務マニュアル・FAQ・対応履歴等の社内情報をAIエージェントが参照できるようにした知識データベース。RAGの参照先となる。",chapter:"Ch.01",fullName:""},
  {id:"15",term:"自律性の4段階",reading:"ジリツセイノヨンダンカイ",meaning:"AIエージェントの自律レベルを反応型・支援型・協働型・自律型に分けた分類。人間がどこまで関与するかで決まり段階的に引き上げる。",chapter:"Ch.01",fullName:""},
  {id:"16",term:"支援型",reading:"シエンガタ",meaning:"AIエージェントが回答案を提示し最終決定は必ず人間が行う段階。現時点の実務で最も主流の自律性レベル。",chapter:"Ch.01",fullName:""},
  {id:"17",term:"協働型",reading:"キョウドウガタ",meaning:"AIエージェントが定型部分を自律的に処理し、複雑な案件は人間にエスカレーションする段階。AIが一部の判断を自律的に行う。",chapter:"Ch.01",fullName:""},
  {id:"18",term:"自律型",reading:"ジリツガタ",meaning:"目標を与えれば計画から実行まで自律的に完遂する最終段階。判断ミスのリスクが大きく業務重要度に応じて段階的に引き上げる。",chapter:"Ch.01",fullName:""},
  {id:"19",term:"モデルルーティング",reading:"",meaning:"タスクの難易度に応じて軽量LLMと高性能LLMを使い分ける設計手法。コストと精度のバランスを取るための実務テクニック。",chapter:"Ch.01",fullName:"Model Routing"},
  {id:"20",term:"起動タイプ",reading:"キドウタイプ",meaning:"AIエージェントが何をきっかけに動き出すかを定める設計概念。指示型・定時型・条件型の3つに分類される。",chapter:"Ch.01",fullName:""},
  {id:"21",term:"指示型",reading:"シジガタ",meaning:"人間がリアルタイムに指示を出して動作する起動タイプ。ChatGPT等にプロンプトを入力する基本形がこれに該当。",chapter:"Ch.01",fullName:""},
  {id:"22",term:"定時型",reading:"テイジガタ",meaning:"あらかじめ設定した時刻・曜日・頻度に従って自動で動作する起動タイプ。導入効果が見えやすく初期導入や効果検証に向く。",chapter:"Ch.01",fullName:""},
  {id:"23",term:"条件型",reading:"ジョウケンガタ",meaning:"特定の出来事の発生をきっかけに自動で動作する起動タイプ。現場に追加作業を求めず業務に溶け込ませる設計パターン。",chapter:"Ch.01",fullName:""},
  {id:"24",term:"RPA",reading:"アールピーエー",meaning:"ロボティック・プロセス・オートメーション。ルールが明確な定型作業を自動化する技術。AIエージェントとは異なり判断は伴わない。",chapter:"Ch.01",fullName:"Robotic Process Automation"},
  {id:"25",term:"MCP",reading:"エムシーピー",meaning:"AIエージェントと外部ツールの接続を共通規格で扱えるようにするオープン標準。2024年11月Anthropicが公開しM×N問題を解消する。",chapter:"Ch.01",fullName:"Model Context Protocol"},
  {id:"26",term:"API",reading:"エーピーアイ",meaning:"あるソフトウェアが別のソフトウェアの機能を呼び出すための窓口。ツールごとに専用の窓口があり書式も異なる。",chapter:"Ch.01",fullName:"Application Programming Interface"},
  {id:"27",term:"M×N問題",reading:"エムバイエヌモンダイ",meaning:"M個のAIモデルとN個のツールを個別接続するとM×N通りの接続開発が必要になる課題。MCP対応により M+N に削減できる。",chapter:"Ch.01",fullName:""},
  {id:"28",term:"ROI",reading:"アールオーアイ",meaning:"投資対効果。投じた資金に対してどれだけのリターンが得られたかを示す指標。AI導入判断ではTCOと組み合わせて評価する。",chapter:"Ch.01",fullName:"Return on Investment"},
  {id:"29",term:"TCO",reading:"ティーシーオー",meaning:"総所有コスト。API利用料だけでなく初期構築費・ナレッジ整備費・運用保守人件費など導入から運用までの総コストを指す。",chapter:"Ch.01",fullName:"Total Cost of Ownership"},
  {id:"30",term:"定量的メリット",reading:"テイリョウテキメリット",meaning:"工数削減・人件費削減・エラー率低減など数値で測定できる価値。経営層への説明で説得力を持つ。",chapter:"Ch.01",fullName:""},
  {id:"31",term:"定性的メリット",reading:"テイセイテキメリット",meaning:"顧客体験向上・従業員体験向上など数値化しにくいが組織にとって重要な価値。現場担当者に響く訴求軸。",chapter:"Ch.01",fullName:""},
  {id:"32",term:"信頼性リスク",reading:"シンライセイリスク",meaning:"AIエージェントの出力や判断が正確でないことから生じるリスク。代表例がハルシネーションで、RAGなどで対策する。",chapter:"Ch.01",fullName:""},
  {id:"33",term:"形骸化リスク",reading:"ケイガイカリスク",meaning:"AIエージェントを導入しても現場で使われない状態に陥るリスク。条件型起動や利用率モニタリングで対策する。",chapter:"Ch.01",fullName:""},
  {id:"34",term:"ブラックボックス化リスク",reading:"",meaning:"管理されないままAIエージェントが組織内で増殖し誰が何を管理しているか不明になるリスク。野良エージェントの発生原因。",chapter:"Ch.01",fullName:""},
  {id:"35",term:"野良エージェント",reading:"ノラエージェント",meaning:"公式な管理対象になっていないAIエージェント。各部署や個人が独自に作成し管理台帳・統制の対象にしていないもの。",chapter:"Ch.01",fullName:""},
  {id:"36",term:"セキュリティ・倫理リスク",reading:"",meaning:"情報漏えい・不正利用・偏った出力・不適切な判断など安全性・公平性・法令順守に関わるリスク。多層的な対策が必要。",chapter:"Ch.01",fullName:""},
  {id:"37",term:"プロンプトインジェクション",reading:"",meaning:"悪意のある入力でAIエージェントの動作を本来の意図と異なる方向に誘導する攻撃手法。入力・出力両面の制御が必要。",chapter:"Ch.01",fullName:"Prompt Injection"},
  {id:"38",term:"バイアス",reading:"",meaning:"学習・参照データに含まれる偏りがそのまま出力に反映されるリスク。属性ごとに精度差が出ると公平性の観点で問題化する。",chapter:"Ch.01",fullName:"Bias"},
  {id:"39",term:"仕事・業務・作業",reading:"シゴト・ギョウム・サギョウ",meaning:"業務の構造的理解の3階層。仕事は組織の目的/役割、業務は仕事を実現する繰り返しの流れ、作業は業務を構成する具体的な行為。",chapter:"Ch.02",fullName:""},
  {id:"40",term:"IPOモデル",reading:"アイピーオーモデル",meaning:"業務をInput(入力)・Process(処理)・Output(出力)の3要素で捉えるフレームワーク。最も粗い業務可視化手法。",chapter:"Ch.02",fullName:"Input Process Output"},
  {id:"41",term:"As-Is分析",reading:"アズイズブンセキ",meaning:"業務の「現在の姿」をIPOに沿って事実だけで記録する分析手法。改善案を混ぜず現状をありのまま可視化することが原則。",chapter:"Ch.02",fullName:"As-Is Analysis"},
  {id:"42",term:"To-Be分析",reading:"トゥービーブンセキ",meaning:"業務の「あるべき姿」をAI前提で再設計する分析手法。既存業務をそのままAI化せず本質的な業務プロセス再設計を目指す。",chapter:"Ch.02",fullName:"To-Be Analysis"},
  {id:"43",term:"BPR",reading:"ビーピーアール",meaning:"既存の業務プロセスを根本から問い直して再設計する手法。1990年代にハマーとチャンピーが提唱した業務改革のアプローチ。",chapter:"Ch.02",fullName:"Business Process Reengineering"},
  {id:"44",term:"汚いプロセスの自動化",reading:"キタナイプロセスノジドウカ",meaning:"非効率な業務をそのまま自動化してしまう失敗パターン。「既存の問題を自動化することだ」とハマーが警告した典型的な罠。",chapter:"Ch.02",fullName:"Automating a Dirty Process"},
  {id:"45",term:"ECRS",reading:"イクルス",meaning:"BPRの実務フレームワーク。Eliminate(排除)・Combine(結合)・Rearrange(順序変更)・Simplify(簡素化)の頭文字。効果順に検討する。",chapter:"Ch.02",fullName:"Eliminate Combine Rearrange Simplify"},
  {id:"46",term:"SIPOC分析",reading:"サイポックブンセキ",meaning:"IPOの前後にSupplier(供給者)とCustomer(受取者)を加えて業務を5要素で整理する可視化手法。関係者の漏れを防ぐ。",chapter:"Ch.02",fullName:"Supplier Input Process Output Customer"},
  {id:"47",term:"HTA",reading:"エイチティーエー",meaning:"業務をAIエージェントが処理できる最小単位(アトミック・タスク)まで階層的に分解する手法。階層的タスク分析。",chapter:"Ch.02",fullName:"Hierarchical Task Analysis"},
  {id:"48",term:"アトミック・タスク",reading:"",meaning:"HTAで業務を分解した最小単位の作業。各タスクをAI処理・定型処理(RPA)・人間担当のいずれかに振り分けて担当を判断する。",chapter:"Ch.02",fullName:"Atomic Task"},
  {id:"49",term:"業務フロー図",reading:"ギョウムフローズ",meaning:"担当者・部署を縦軸、時間を横軸に並べて業務の流れを図示する可視化手法。スイムレーン図とも呼び最も詳細な可視化となる。",chapter:"Ch.02",fullName:""},
  {id:"50",term:"スイムレーン図",reading:"",meaning:"横軸に時間・縦軸に担当者を配置し作業の流れと引き渡しを可視化する図。誰から誰に何が渡るかが一目で把握できる。",chapter:"Ch.02",fullName:"Swimlane Diagram"},
  {id:"51",term:"暗黙知",reading:"アンモクチ",meaning:"個人の経験や勘に基づき身についているが言葉や文書として整理されていない知識。AIエージェントは参照できない。",chapter:"Ch.03",fullName:"Tacit Knowledge"},
  {id:"52",term:"形式知",reading:"ケイシキチ",meaning:"言葉・数値・図表で表現され文書・データとして共有できる知識。AIエージェントが参照できるのは形式知だけ。",chapter:"Ch.03",fullName:"Explicit Knowledge"},
  {id:"53",term:"ナレッジマネジメント",reading:"",meaning:"個人に属する知識を整理・共有して組織として活用できる状態にする取り組み。AIエージェント導入の前提条件となる。",chapter:"Ch.03",fullName:"Knowledge Management"},
  {id:"54",term:"SECIモデル",reading:"セキモデル",meaning:"野中郁次郎が提唱した知識循環モデル。共同化・表出化・連結化・内面化の4フェーズで暗黙知と形式知が組織内を循環する。",chapter:"Ch.03",fullName:"Socialization Externalization Combination Internalization"},
  {id:"55",term:"共同化",reading:"キョウドウカ",meaning:"SECIモデルの第1段階。暗黙知が暗黙知として人から人へ「一緒に体験する」ことで伝わるフェーズ。",chapter:"Ch.03",fullName:"Socialization"},
  {id:"56",term:"表出化",reading:"ヒョウシュツカ",meaning:"SECIモデルの第2段階。暗黙知を言語化して形式知に変換するフェーズ。AIエージェント導入と最も関連が深い。",chapter:"Ch.03",fullName:"Externalization"},
  {id:"57",term:"連結化",reading:"レンケツカ",meaning:"SECIモデルの第3段階。形式知同士を組み合わせて新しい形式知を生み出すフェーズ。複数AIや外部DBの連携がこれに当たる。",chapter:"Ch.03",fullName:"Combination"},
  {id:"58",term:"内面化",reading:"ナイメンカ",meaning:"SECIモデルの第4段階。形式知が実践を通じて暗黙知として身体化されるフェーズ。新人がAIを使いながら業務を覚える状態。",chapter:"Ch.03",fullName:"Internalization"},
  {id:"59",term:"ファインチューニング",reading:"",meaning:"学習データを追加してLLMに知識や出力傾向を覚え込ませる手法。文体・トーン調整に向くが頻繁な知識更新には不向き。",chapter:"Ch.03",fullName:"Fine-tuning"},
  {id:"60",term:"構造化データ",reading:"コウゾウカデータ",meaning:"データベースのテーブルやExcelのように行と列の明確な構造を持つデータ。従来のITシステムが最も得意とする領域。",chapter:"Ch.03",fullName:"Structured Data"},
  {id:"61",term:"半構造化データ",reading:"ハンコウゾウカデータ",meaning:"完全な構造は持たないがタグやキーで部分的に整理されたデータ。JSONやXMLが代表例でAIエージェントの入出力に頻繁に登場する。",chapter:"Ch.03",fullName:"Semi-structured Data"},
  {id:"62",term:"メタデータ",reading:"",meaning:"データに付与する属性情報(カテゴリ・更新日・対応OS等)。RAGの検索精度を大きく左右し、フィルタリングに不可欠。",chapter:"Ch.03",fullName:"Metadata"},
  {id:"63",term:"RAG",reading:"ラグ",meaning:"AIが回答時にナレッジベースを検索して関連情報を取得し、その情報を元に回答を生成する仕組み。検索拡張生成と訳す。",chapter:"Ch.03",fullName:"Retrieval-Augmented Generation"},
  {id:"64",term:"チャンク分割",reading:"",meaning:"ドキュメントを適切なサイズのかたまり(チャンク)に分割する工程。1つのトピックが1つのチャンクに収まるサイズが目安。",chapter:"Ch.03",fullName:"Chunking"},
  {id:"65",term:"ベクトル化",reading:"",meaning:"テキストを数値の列に変換する工程。意味が近いテキスト同士が数値空間で近い位置に配置されセマンティック検索を可能にする。",chapter:"Ch.03",fullName:"Vectorization / Embedding"},
  {id:"66",term:"セマンティック検索",reading:"",meaning:"キーワード完全一致ではなく意味の近さでチャンクを検索する仕組み。表現が異なっても意味が近ければヒットする。",chapter:"Ch.03",fullName:"Semantic Search"},
  {id:"67",term:"グラウンディング",reading:"",meaning:"AIエージェントの回答を外部文書やデータに基づかせる手法。根拠のない内容をもっともらしく答えるリスクを抑える。",chapter:"Ch.03",fullName:"Grounding"},
  {id:"68",term:"リランキング",reading:"",meaning:"ベクトル検索で取得したチャンクを関連度でさらに並べ替える処理。LLMに渡す情報の質を向上させる精度改善手法。",chapter:"Ch.03",fullName:"Reranking"},
  {id:"69",term:"AIガバナンス",reading:"",meaning:"組織としてAIエージェントを利用・管理・監督するための体制・ルール・プロセスの総称。自律性が高まるほど重要性が増す。",chapter:"Ch.03",fullName:"AI Governance"},
  {id:"70",term:"AIポリシー",reading:"",meaning:"組織としてのAIエージェント利用ルールを文書化したもの。許可データと禁止データの明確な定義が核心。",chapter:"Ch.03",fullName:"AI Policy"},
  {id:"71",term:"利用ガイドライン",reading:"",meaning:"AIポリシーの抽象的ルールを現場の行動レベルの指針に翻訳した文書。具体性が質を決める。",chapter:"Ch.03",fullName:""},
  {id:"72",term:"責任分界点",reading:"セキニンブンカイテン",meaning:"AIエージェントが誤った判断をした際に誰が責任を負うかを定める設計概念。AIには法的責任を負わせられないため事前定義が必須。",chapter:"Ch.03",fullName:""},
  {id:"73",term:"AI Readyデータ",reading:"エーアイレディデータ",meaning:"AIエージェントが正確かつ安全に処理・活用できる状態に整備されたデータ。Gartnerは正確性・可視性・追跡可能性・安全性の4特性で定義。",chapter:"Ch.03",fullName:"AI Ready Data"},
  {id:"74",term:"PoC",reading:"ピーオーシー",meaning:"概念実証。本番導入前に限定範囲で有効性と課題を検証する工程。AIプロジェクトの技術・業務適合・効果の不確実性に対処する。",chapter:"Ch.03",fullName:"Proof of Concept"},
  {id:"75",term:"MVP",reading:"エムブイピー",meaning:"最小限の機能で検証できるプロダクト。本番運用ではなく検証可能な最小単位を作って早期に価値を確認するアプローチ。",chapter:"Ch.03",fullName:"Minimum Viable Product"},
  {id:"76",term:"判断ゲート",reading:"ハンダンゲート",meaning:"次ステップに進む前に進むべき条件が揃っているかを確認する意思決定ポイント。条件が揃わなければ前段階に戻すか継続を再考する。",chapter:"Ch.03",fullName:"Decision Gate"},
  {id:"77",term:"3層フレームワーク",reading:"サンソウフレームワーク",meaning:"AIプロジェクトの成功を効果層・定着層・精度層の3層で定義するフレームワーク。定義はトップダウン・達成はボトムアップの二重構造。",chapter:"Ch.03",fullName:""},
  {id:"78",term:"効果層",reading:"コウカソウ",meaning:"3層フレームワークの最上位層。ビジネスに効果が出ているかを測る層で、ここから逆算して定着層・精度層を定義する。",chapter:"Ch.03",fullName:""},
  {id:"79",term:"定着層",reading:"テイチャクソウ",meaning:"3層フレームワークの中間層。現場が実際に使っているかを測る層。PoC中は定性、本運用後は定量で評価を使い分ける。",chapter:"Ch.03",fullName:""},
  {id:"80",term:"精度層",reading:"セイドソウ",meaning:"3層フレームワークの最下位層。AIが正しく答えられるかを測る層。最も定義しやすいが単体での目標値設定は不適切。",chapter:"Ch.03",fullName:""},
  {id:"81",term:"ベースライン測定",reading:"",meaning:"AI導入前の現状業務を数値で記録する作業。これがないと導入後の改善幅を客観的に示せず効果層を評価できない。",chapter:"Ch.03",fullName:""},
  {id:"82",term:"自動化レベル",reading:"ジドウカレベル",meaning:"AIエージェント活用を自律性と仕組み化の程度で4段階に整理した分類。Lv.1アドホック→Lv.2カスタムチャットボット→Lv.3ワークフロー→Lv.4自律型。",chapter:"Ch.04",fullName:""},
  {id:"83",term:"Lv.1 アドホック",reading:"",meaning:"必要なときに都度AIエージェントに指示する段階。ChatGPT等を一回きりで使う形で仕組み化されていない個人的活用レベル。",chapter:"Ch.04",fullName:""},
  {id:"84",term:"Lv.2 カスタムチャットボット",reading:"",meaning:"特定用途に特化したチャットボットを構築する段階。GPTs・Gem・Claudeプロジェクト等でシステムプロンプトとナレッジを設定する。",chapter:"Ch.04",fullName:""},
  {id:"85",term:"Lv.3 ワークフロー",reading:"",meaning:"事前設計した複数ステップをトリガーで自動実行する段階。電車に例えられレールの上を再現性高く走る。最初の本格成果を出しやすい。",chapter:"Ch.04",fullName:""},
  {id:"86",term:"Lv.4 自律型エージェント",reading:"",meaning:"目標を与えるとAIが計画立案・実行・判断を自律的に進める段階。タクシーに例えられ柔軟性がある反面リスク管理が難しい。",chapter:"Ch.04",fullName:""},
  {id:"87",term:"トリガー",reading:"",meaning:"ワークフローを起動させるきっかけ。スケジュールトリガー・イベントトリガー・フォーム送信トリガー・Webhook等の種別がある。",chapter:"Ch.04",fullName:"Trigger"},
  {id:"88",term:"アクション",reading:"",meaning:"トリガー後に実行される処理。データ処理・生成判断・実行連携の3カテゴリに分かれ、複数を連鎖させてワークフローを構成する。",chapter:"Ch.04",fullName:"Action"},
  {id:"89",term:"Webhook",reading:"ウェブフック",meaning:"外部サービス側で発生したイベントをHTTPリクエストで通知する仕組み。イベントトリガーの実装手段として広く使われる。",chapter:"Ch.04",fullName:""},
  {id:"90",term:"Human-in-the-Loop",reading:"",meaning:"AIエージェントの処理プロセスに人間の確認・判断・承認ステップを組み込む設計思想。安全装置でありかつ改善データ蓄積の仕組み。",chapter:"Ch.04",fullName:"Human-in-the-Loop (HITL)"},
  {id:"91",term:"If/Else分岐",reading:"イフエルスブンキ",meaning:"2つの経路への条件分岐。正常系/異常系のような二択でフローを分けるワークフロー設計の基本要素。",chapter:"Ch.04",fullName:""},
  {id:"92",term:"ルーティング",reading:"",meaning:"3つ以上の多方向への振り分けを行う条件分岐。業界別テンプレート選択など複数経路への分岐に使う。",chapter:"Ch.04",fullName:"Routing"},
  {id:"93",term:"フィルタリング",reading:"",meaning:"条件を満たすデータだけを後続処理に通し、それ以外を除外する仕組み。通過か遮断かの選別で不要な負荷を抑える。",chapter:"Ch.04",fullName:"Filtering"},
  {id:"94",term:"エラーハンドリング",reading:"",meaning:"想定外の事態への備えを設計する仕組み。If/Elseの応用で正常系と異常系に分岐させフォールバック処理を用意する。",chapter:"Ch.04",fullName:"Error Handling"},
  {id:"95",term:"フォールバック",reading:"",meaning:"エラー発生時に代替の処理を実行して業務が完全停止しないようにする仕組み。Slack通知や手動対応依頼などが代表例。",chapter:"Ch.04",fullName:"Fallback"},
  {id:"96",term:"コンテキストエンジニアリング",reading:"",meaning:"LLMに渡す文脈情報を体系的に設計・管理する技術。Andrej Karpathyが提唱しプロンプトエンジニアリングを包含する上位概念。",chapter:"Ch.04",fullName:"Context Engineering"},
  {id:"97",term:"システムプロンプト",reading:"",meaning:"AIエージェントの役割・前提条件・制約条件・行動指針を定義するベース設定。エージェントが守るべき軸として最初に設計する。",chapter:"Ch.04",fullName:"System Prompt"},
  {id:"98",term:"Lost in the Middle",reading:"ロストインザミドル",meaning:"LLMがコンテキストの先頭と末尾を参照しやすく中間部分の情報を見落としやすい現象。スタンフォード大学の研究で示された認識の限界。",chapter:"Ch.04",fullName:""},
  {id:"99",term:"短期メモリ",reading:"タンキメモリ",meaning:"現在のセッション内の対話履歴と状態情報。ツール実行結果や中間判断を保持してエージェントが文脈を理解できるようにする。",chapter:"Ch.04",fullName:"Short-term Memory"},
  {id:"100",term:"長期メモリ",reading:"チョウキメモリ",meaning:"セッションをまたいで蓄積される持続的情報。手続き記憶・エピソード記憶・意味記憶の3種類があり将来の判断に活用される。",chapter:"Ch.04",fullName:"Long-term Memory"},
  {id:"101",term:"構造化出力",reading:"コウゾウカシュツリョク",meaning:"LLMの応答形式をJSONや表形式など後続処理が扱いやすい形に制御する設計。形式がぶれると解析エラーの原因になる。",chapter:"Ch.04",fullName:"Structured Output"},
  {id:"102",term:"コンテキスト汚染",reading:"",meaning:"ハルシネーション等の不正確情報がコンテキストに混入し後続判断に悪影響を与える問題。誤情報が連鎖的に拡散するリスクがある。",chapter:"Ch.04",fullName:"Context Contamination"},
  {id:"103",term:"デリゲーション",reading:"",meaning:"AIエージェントへの権限委譲。判断権限と実行権限の範囲を業務リスクレベルに応じて段階的に設計する組織設計上の概念。",chapter:"Ch.05",fullName:"Delegation"},
  {id:"104",term:"組織文化診断",reading:"ソシキブンカシンダン",meaning:"ミスへの許容度・新ツールへの受容度・意思決定スピードと構造の3観点で組織を診断する手法。AI導入時の障壁を事前把握できる。",chapter:"Ch.05",fullName:""},
  {id:"105",term:"中央集権型",reading:"チュウオウシュウケンガタ",meaning:"CoEを設置し全社AI施策を一元管理する推進体制。統制とガバナンスに強いが現場速度に追いつけずボトルネックになりやすい。",chapter:"Ch.05",fullName:""},
  {id:"106",term:"分散型",reading:"ブンサンガタ",meaning:"各事業部が独自にAIエージェント導入を推進する体制。現場ニーズへの即応に強いが統制が効かず野良エージェントが発生しやすい。",chapter:"Ch.05",fullName:""},
  {id:"107",term:"ハイブリッド型",reading:"",meaning:"中央でガバナンス枠組みを整え各部署が枠内で自律的に導入を進める折衷型体制。統制と自律のバランスをどう取るかが論点。",chapter:"Ch.05",fullName:""},
  {id:"108",term:"CoE",reading:"シーオーイー",meaning:"AIエージェント推進の専門組織。ガバナンス・技術支援・ナレッジ共有の3機能を担う。中央集権型/ハイブリッド型で中核を担う。",chapter:"Ch.05",fullName:"Center of Excellence"},
  {id:"109",term:"JD",reading:"ジェイディー",meaning:"職務定義書。AI時代には「何ができるか」から「どう考え、何を問えるか」へ評価軸を移す再設計が求められる。",chapter:"Ch.05",fullName:"Job Description"},
  {id:"110",term:"リスキリング",reading:"",meaning:"従来の職務が代替または変化した際に新スキルを習得して別の職務へ移ること。職務そのものが変わる場合の人材育成。",chapter:"Ch.05",fullName:"Reskilling"},
  {id:"111",term:"アップスキリング",reading:"",meaning:"現在の職務を継続しながら必要なスキルを追加的に習得し業務遂行能力を高めること。職務は変えずに高度化させる育成。",chapter:"Ch.05",fullName:"Upskilling"},
  {id:"112",term:"アウトプット指標",reading:"",meaning:"処理件数や稼働率など活動量を測る指標。それだけでは品質や成果を測れず、アウトカム指標と組み合わせる必要がある。",chapter:"Ch.05",fullName:"Output Metric"},
  {id:"113",term:"アウトカム指標",reading:"",meaning:"業務改善や顧客価値などビジネス成果を測る指標。AIエージェント導入の本質的な成果を示すためKPI設計の主軸となる。",chapter:"Ch.05",fullName:"Outcome Metric"},
  {id:"114",term:"KGI",reading:"ケージーアイ",meaning:"重要目標達成指標。プロジェクトが最終的に目指すゴールを表す。例：月次決算の早期化など。",chapter:"Ch.05",fullName:"Key Goal Indicator"},
  {id:"115",term:"KPI",reading:"ケーピーアイ",meaning:"重要業績評価指標。KGI達成に向けた中間指標。運用中の継続的な成果測定に使うため合格基準とは区別される。",chapter:"Ch.05",fullName:"Key Performance Indicator"},
  {id:"116",term:"OKR",reading:"オーケーアール",meaning:"目標と主要な成果の管理手法。プロジェクト初期フェーズでKPIと組み合わせて使われる。Discovery〜PoCで活用しやすい。",chapter:"Ch.05",fullName:"Objectives and Key Results"},
  {id:"117",term:"チェンジマネジメント",reading:"",meaning:"組織変革を計画的に推進する手法。AI導入の心理的抵抗を「AIに頼ると自分のスキルが落ちる」等の不安に対応する形で乗り越える。",chapter:"Ch.05",fullName:"Change Management"},
  {id:"118",term:"5Dモデル",reading:"ファイブディーモデル",meaning:"AIエージェント導入プロジェクトの5ステップ。Discovery・Definition・Design・Development & PoC・Deployment & Scale。",chapter:"Ch.06",fullName:""},
  {id:"119",term:"Discovery",reading:"ディスカバリー",meaning:"5Dモデルの第1ステップ。ボトルネック分析・AI適合性診断・優先順位マトリクスで「何を自動化するか」を発見・選定する。",chapter:"Ch.06",fullName:""},
  {id:"120",term:"ボトルネック分析",reading:"",meaning:"プロセス全体の生産性を制約している最も弱い箇所を特定する分析。Discoveryの出発点で「処理時間」「ミス頻発」等で見極める。",chapter:"Ch.06",fullName:""},
  {id:"121",term:"AI適合性診断",reading:"",meaning:"業務がAIエージェント解決に適するかを①非構造化データの有無②文脈判断の必要性③ミス許容度の3基準で診断する手法。",chapter:"Ch.06",fullName:""},
  {id:"122",term:"優先順位マトリクス",reading:"",meaning:"効果の大きさと実現のしやすさの2軸で候補業務を整理し着手順を判断するフレームワーク。効果大×実現容易が最優先。",chapter:"Ch.06",fullName:""},
  {id:"123",term:"クイックウィン",reading:"",meaning:"比較的短期間で成果を出しやすい対象業務。MVPアプローチの最初の対象として選び信頼を積み上げてから範囲を広げる。",chapter:"Ch.06",fullName:"Quick Win"},
  {id:"124",term:"Definition",reading:"デフィニション",meaning:"5Dモデルの第2ステップ。業務フローチャート・要件定義書・ペルソナ・合格基準を作成し対象業務を構造化する段階。",chapter:"Ch.06",fullName:""},
  {id:"125",term:"要件定義書",reading:"ヨウケンテイギショ",meaning:"AIエージェントへの要求を機能要件・非機能要件・制約条件・前提条件の4要素で整理した文書。実装側との共通土台になる。",chapter:"Ch.06",fullName:"Requirements Definition"},
  {id:"126",term:"機能要件",reading:"キノウヨウケン",meaning:"AIエージェントに何をさせたいかを定める要件。「応募書類からスキル情報を抽出する」等の機能を具体的に記述する。",chapter:"Ch.06",fullName:"Functional Requirements"},
  {id:"127",term:"非機能要件",reading:"ヒキノウヨウケン",meaning:"どの程度の品質や条件で動作してほしいかを定める要件。応答速度・安定性・可用性などの水準を記述する。",chapter:"Ch.06",fullName:"Non-functional Requirements"},
  {id:"128",term:"ペルソナ",reading:"",meaning:"AIエージェントを利用するユーザーの典型像。AI固有のペルソナでは「出力をどう使い何を判断するか」を描写する。",chapter:"Ch.06",fullName:"Persona"},
  {id:"129",term:"合格基準",reading:"ゴウカクキジュン",meaning:"AIエージェントの品質が業務に使えるレベルに達したかを判断する定量基準。PoCの合否判定に使う一回限りの基準。",chapter:"Ch.06",fullName:""},
  {id:"130",term:"Design",reading:"デザイン",meaning:"5Dモデルの第3ステップ。コンテキスト設計・I/O設計・セキュリティ設計の3領域でAIエージェントの技術設計を行う。",chapter:"Ch.06",fullName:""},
  {id:"131",term:"Few-shot",reading:"フューショット",meaning:"プロンプト内に少数の例を示してLLMに判断パターンを学ばせる手法。明確な合格例・不合格例・境界事例をバランスよく含める。",chapter:"Ch.06",fullName:"Few-shot Learning"},
  {id:"132",term:"Chain-of-Thought",reading:"",meaning:"AIエージェントに思考過程を段階的に出力させる手法。一気に結論より段階的に考えるほうが複雑な問題で正確性が高まる。",chapter:"Ch.06",fullName:"Chain-of-Thought (CoT)"},
  {id:"133",term:"I/O設計",reading:"アイオーセッケイ",meaning:"AIエージェントに何を入力し、どんな形式で出力を受け取るかを設計する領域。JSONスキーマで形式を統一する。",chapter:"Ch.06",fullName:"Input/Output Design"},
  {id:"134",term:"JSONスキーマ",reading:"ジェイソンスキーマ",meaning:"JSONの構造をあらかじめ定めた設計ルール。項目名・データ型・必須項目・値の範囲を事前定義し、AIの出力形式を統制する。",chapter:"Ch.06",fullName:"JSON Schema"},
  {id:"135",term:"バリデーション",reading:"",meaning:"AIエージェントの出力が期待した形式かを自動確認する仕組み。不整合があれば再生成や人間へのエスカレーションを行う。",chapter:"Ch.06",fullName:"Validation"},
  {id:"136",term:"アクセス制御",reading:"",meaning:"AIエージェントが参照できる情報の範囲を制限する設計。氏名・住所などをマスキングして渡す等、入力側のセキュリティ制御。",chapter:"Ch.06",fullName:"Access Control"},
  {id:"137",term:"ガードレール",reading:"",meaning:"AIエージェントの出力内容や動作に制限を設ける仕組み。個人情報や不適切表現の出力遮断・再生成要求を行う出力側の制御。",chapter:"Ch.06",fullName:"Guardrail"},
  {id:"138",term:"Development & PoC",reading:"デベロップメントアンドピーオーシー",meaning:"5Dモデルの第4ステップ。プロトタイプ開発と合格基準に基づく検証を反復するフェーズ。フィードバックループで精度を引き上げる。",chapter:"Ch.06",fullName:""},
  {id:"139",term:"サンドボックス",reading:"",meaning:"本番環境に影響を与えずAIエージェントを試験的に動かす隔離環境。Development段階での検証に使う安全な実験場。",chapter:"Ch.06",fullName:"Sandbox"},
  {id:"140",term:"フィードバックループ",reading:"",meaning:"実行・評価・改善・再実行の改善サイクル全体を指す概念。合格基準に届かない場合に回してプロンプトやFew-shotを改善する。",chapter:"Ch.06",fullName:"Feedback Loop"},
  {id:"141",term:"Deployment & Scale",reading:"デプロイメントアンドスケール",meaning:"5Dモデルの第5ステップ。パイロット導入・ロールアウト・スケーリングと段階的に展開し組織に定着させる最終フェーズ。",chapter:"Ch.06",fullName:""},
  {id:"142",term:"パイロット導入",reading:"パイロットドウニュウ",meaning:"全社一斉ではなく限定された部門・チーム・業務でまず本番稼働させる導入方式。実環境特有の問題を小さな範囲で把握する。",chapter:"Ch.06",fullName:"Pilot"},
  {id:"143",term:"ロールアウト",reading:"",meaning:"パイロットの成功を受けて対象範囲を段階的に拡大していくプロセス。同じ機能をより多くの人に届け、リスクを管理可能に保つ。",chapter:"Ch.06",fullName:"Rollout"},
  {id:"144",term:"スケーリング",reading:"",meaning:"AIエージェントの処理能力や適用範囲を拡大すること。ロールアウトと異なり対象業務拡大や新機能追加など能力そのものの拡張を含む。",chapter:"Ch.06",fullName:"Scaling"},
  {id:"145",term:"AI-SECIモデル",reading:"エーアイセキモデル",meaning:"従来のSECIモデルを人間とAIエージェント間の知識循環に拡張した概念。エージェント運用を通じて知的資産が厚みを増す構造。",chapter:"Ch.06",fullName:""},
  {id:"146",term:"エスカレーション",reading:"",meaning:"AIエージェントが処理できない/すべきでないケースを人間に引き継ぐ仕組み。HITLや異常時の責任ある運用設計に必須。",chapter:"Ch.06",fullName:"Escalation"},
  {id:"147",term:"KPIモニタリング",reading:"",meaning:"アウトカム指標を中心にAIエージェント運用後の成果を継続的に追跡する仕組み。短期と長期のアウトカム指標を分けて設計する。",chapter:"Ch.06",fullName:""},
];

const MASTERED_KEY = 'fc_mastered';

let _fcTerms = [];
let _fcFiltered = [];
let _fcIndex = 0;
let _fcFlipped = false;
let _fcReady = false;

function getMastered() {
  try { return new Set(JSON.parse(localStorage.getItem(MASTERED_KEY) || '[]')); }
  catch(e) { return new Set(); }
}
function setMastered(s) {
  try { localStorage.setItem(MASTERED_KEY, JSON.stringify([...s])); } catch(e) {}
}

function loadFlashcard() {
  if (_fcReady && _fcTerms.length > 0) { renderFlashcard(); return; }
  const loading = document.getElementById('fc-loading');
  if (loading) loading.classList.add('hidden');

  _fcTerms = FC_TERMS;
  _fcReady = true;

  buildChapterFilter();
  applyFilter('all');
}

function buildChapterFilter() {
  const el = document.getElementById('fc-chapter-filter');
  if (!el) return;
  el.innerHTML = FC_CHAPTERS.map(c =>
    `<button class="fc-chapter-btn${c.key === 'all' ? ' fc-chapter-btn--active' : ''}" data-ch="${c.key}">${c.label}</button>`
  ).join('');
  el.addEventListener('click', e => {
    const btn = e.target.closest('.fc-chapter-btn');
    if (!btn) return;
    el.querySelectorAll('.fc-chapter-btn').forEach(b => b.classList.toggle('fc-chapter-btn--active', b === btn));
    applyFilter(btn.dataset.ch);
  });
}

function applyFilter(chKey) {
  _fcFiltered = chKey === 'all'
    ? _fcTerms.slice()
    : _fcTerms.filter(t => t.chapter === chKey);
  _fcIndex = 0;
  renderFlashcard();
}

function renderFlashcard() {
  const mastered = getMastered();
  const total = _fcFiltered.length;
  const masteredCount = _fcFiltered.filter(t => mastered.has(t.id)).length;

  document.getElementById('fc-progress').textContent =
    total > 0 ? `${_fcIndex + 1} / ${total}  |  覚えた: ${masteredCount}語` : '用語がありません';

  if (total === 0) return;
  const t = _fcFiltered[_fcIndex];
  const isMastered = mastered.has(t.id);

  // 表面: 意味を表示
  document.getElementById('fc-meaning').textContent = t.meaning;
  document.getElementById('fc-chapter-f').textContent = t.chapter;

  // 裏面: 単語・画像を表示
  document.getElementById('fc-term').textContent = t.term;
  document.getElementById('fc-reading').textContent = t.reading ? `（${t.reading}）` : '';
  document.getElementById('fc-fullname').textContent = t.fullName || '';
  document.getElementById('fc-chapter-b').textContent = t.chapter;

  const img = document.getElementById('fc-image');
  if (img) {
    img.src = `images/${t.id}.jpg`;
    img.alt = t.term;
  }

  const masteredBtn = document.getElementById('fc-mastered');
  if (isMastered) {
    masteredBtn.textContent = '覚えた ✓';
    masteredBtn.classList.add('fc-mastered-btn--done');
  } else {
    masteredBtn.textContent = '覚えた';
    masteredBtn.classList.remove('fc-mastered-btn--done');
  }

  // 表面に戻す
  _fcFlipped = false;
  const inner = document.getElementById('fc-card-inner');
  if (inner) inner.classList.remove('fc-card__inner--flipped');

  document.getElementById('fc-mastered-count').textContent =
    masteredCount > 0 ? `覚えた用語: ${masteredCount} / ${total}語` : '';
}

function initFlashcardEvents() {
  const card = document.getElementById('fc-card');
  if (card) {
    card.addEventListener('click', () => {
      _fcFlipped = !_fcFlipped;
      document.getElementById('fc-card-inner').classList.toggle('fc-card__inner--flipped', _fcFlipped);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }

  document.getElementById('fc-prev').addEventListener('click', () => {
    if (_fcFiltered.length === 0) return;
    _fcIndex = (_fcIndex - 1 + _fcFiltered.length) % _fcFiltered.length;
    renderFlashcard();
  });

  document.getElementById('fc-next').addEventListener('click', () => {
    if (_fcFiltered.length === 0) return;
    _fcIndex = (_fcIndex + 1) % _fcFiltered.length;
    renderFlashcard();
  });

  document.getElementById('fc-mastered').addEventListener('click', async e => {
    e.stopPropagation();
    if (_fcFiltered.length === 0) return;
    const t = _fcFiltered[_fcIndex];
    const mastered = getMastered();
    const wasNew = !mastered.has(t.id);
    if (mastered.has(t.id)) mastered.delete(t.id);
    else mastered.add(t.id);
    setMastered(mastered);
    renderFlashcard();

    if (wasNew) {
      const totalMastered = mastered.size;
      if (totalMastered > 0 && totalMastered % 3 === 0) {
        const res = await api('recordFlashcardMastered', { mastered_count: totalMastered }, 'POST');
        if (res.status === 'ok' && res.data.newly_unlocked && res.data.newly_unlocked.length > 0) {
          if (typeof showUnlocks === 'function') showUnlocks(res.data.newly_unlocked);
        }
      }
    }
  });
}

(function() {
  let _eventsReady = false;
  const orig = window.loadFlashcard;
  window.loadFlashcard = function() {
    if (!_eventsReady) { initFlashcardEvents(); _eventsReady = true; }
    orig();
  };
})();
