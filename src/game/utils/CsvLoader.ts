export class CsvLoader {
    /**
     * 指定されたパスからCSVデータを読み込み
     * @param filePath 
     * @returns 各行の文字列を配列として返す
     * @throws ファイルが存在しない、または読み込みに失敗した場合
     */
    public static async loadCsv(filePath: string): Promise<string[]> {
        try {
            const response = await fetch(filePath);

            const text = await response.text();
            const rows = text.replace(/\r/g, "").trim().split("\n");

            // 💡 最低限のCSV形式チェック（カンマ区切りが含まれているか）
            if (rows.length === 0 || !rows[0].includes(",")) {
                throw new Error(`CSV形式ではないデータが返されました: ${filePath}`);
            }

            return rows;
        } catch (error) {
            console.error("CSV読み込みエラー:", error);
            throw new Error(`CSVファイルの読み込みに失敗しました: ${filePath}`);
        }
    }
}