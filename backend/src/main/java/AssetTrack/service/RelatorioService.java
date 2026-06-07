package AssetTrack.service;

import AssetTrack.dto.EquipamentoResponseDTO;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import AssetTrack.dto.ManutencaoResponseDTO;
import AssetTrack.dto.MovimentacaoResponseDTO;
import AssetTrack.service.ManutencaoService;
import AssetTrack.service.MovimentacaoService;

@Service
public class RelatorioService {

    @Autowired
    private EquipamentoService equipamentoService;

    @Autowired
    private ManutencaoService manutencaoService;

    @Autowired
    private MovimentacaoService movimentacaoService;

    public List<EquipamentoResponseDTO> gerarRelatorioEquipamentos() {

        return equipamentoService.listarTodos();

    }

    public List<EquipamentoResponseDTO> gerarRelatorioEquipamentos(
            String status,
            String setor
    ) {

        return equipamentoService.listarComFiltros(status, setor);

    }

    public ByteArrayInputStream gerarExcelEquipamentos() throws IOException {

        List<EquipamentoResponseDTO> equipamentos = equipamentoService.listarTodos();

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Equipamentos");

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Nome");
        header.createCell(1).setCellValue("Número Série");
        header.createCell(2).setCellValue("Status");
        header.createCell(3).setCellValue("Setor");

        int rowNum = 1;

        for (EquipamentoResponseDTO equipamento : equipamentos) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(equipamento.nomeEquipamento());
            row.createCell(1).setCellValue(equipamento.numeroSerie());
            row.createCell(2).setCellValue(equipamento.statusAtual());
            row.createCell(3).setCellValue(equipamento.nomeSetor());

        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());

    }

    public ByteArrayInputStream gerarPdfEquipamentos() {

        List<EquipamentoResponseDTO> equipamentos =
                equipamentoService.listarTodos();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter writer =
                new PdfWriter(out);

        PdfDocument pdf =
                new PdfDocument(writer);

        Document document =
                new Document(pdf);

        document.add(
                new Paragraph("Relatório de Equipamentos")
        );

        Table table = new Table(4);

        table.addHeaderCell("Nome");
        table.addHeaderCell("Número Série");
        table.addHeaderCell("Status");
        table.addHeaderCell("Setor");

        for (EquipamentoResponseDTO equipamento : equipamentos) {

            table.addCell(equipamento.nomeEquipamento());
            table.addCell(equipamento.numeroSerie());
            table.addCell(equipamento.statusAtual());
            table.addCell(equipamento.nomeSetor());

        }

        document.add(table);

        document.close();

        return new ByteArrayInputStream(
                out.toByteArray()
        );

    }

    public ByteArrayInputStream gerarExcelManutencoes() throws IOException {

        List<ManutencaoResponseDTO> manutencoes =
                manutencaoService.listarTodasManutencoes();

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Manutencoes");

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Equipamento");
        header.createCell(1).setCellValue("Tecnico");
        header.createCell(2).setCellValue("Tipo");
        header.createCell(3).setCellValue("Status");

        int rowNum = 1;

        for (ManutencaoResponseDTO manutencao : manutencoes) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(manutencao.nomeEquipamento());
            row.createCell(1).setCellValue(manutencao.nomeTecnico());
            row.createCell(2).setCellValue(manutencao.tipoManutencao());
            row.createCell(3).setCellValue(manutencao.status());

        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());

    }

    public ByteArrayInputStream gerarPdfManutencoes() {

        List<ManutencaoResponseDTO> manutencoes =
                manutencaoService.listarTodasManutencoes();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter writer =
                new PdfWriter(out);

        PdfDocument pdf =
                new PdfDocument(writer);

        Document document =
                new Document(pdf);

        document.add(
                new Paragraph("Relatório de Manutenções")
        );

        Table table = new Table(4);

        table.addHeaderCell("Equipamento");
        table.addHeaderCell("Tecnico");
        table.addHeaderCell("Tipo");
        table.addHeaderCell("Status");

        for (ManutencaoResponseDTO manutencao : manutencoes) {

            table.addCell(manutencao.nomeEquipamento());
            table.addCell(manutencao.nomeTecnico());
            table.addCell(manutencao.tipoManutencao());
            table.addCell(manutencao.status());

        }

        document.add(table);

        document.close();

        return new ByteArrayInputStream(
                out.toByteArray()
        );

    }

    public ByteArrayInputStream gerarExcelMovimentacoes() throws IOException {

        List<MovimentacaoResponseDTO> movimentacoes =
                movimentacaoService.listarTodas();

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Movimentacoes");

        Row header = sheet.createRow(0);

        header.createCell(0).setCellValue("Equipamento");
        header.createCell(1).setCellValue("Origem");
        header.createCell(2).setCellValue("Destino");
        header.createCell(3).setCellValue("Status");

        int rowNum = 1;

        for (MovimentacaoResponseDTO movimentacao : movimentacoes) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(movimentacao.equipamento());
            row.createCell(1).setCellValue(movimentacao.setorOrigem());
            row.createCell(2).setCellValue(movimentacao.setorDestino());
            row.createCell(3).setCellValue(movimentacao.status());

        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());

    }

    public ByteArrayInputStream gerarPdfMovimentacoes() {

        List<MovimentacaoResponseDTO> movimentacoes =
                movimentacaoService.listarTodas();

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        PdfWriter writer =
                new PdfWriter(out);

        PdfDocument pdf =
                new PdfDocument(writer);

        Document document =
                new Document(pdf);

        document.add(
                new Paragraph("Relatório de Movimentações")
        );

        Table table = new Table(4);

        table.addHeaderCell("Equipamento");
        table.addHeaderCell("Origem");
        table.addHeaderCell("Destino");
        table.addHeaderCell("Status");

        for (MovimentacaoResponseDTO movimentacao : movimentacoes) {

            table.addCell(movimentacao.equipamento());
            table.addCell(movimentacao.setorOrigem());
            table.addCell(movimentacao.setorDestino());
            table.addCell(movimentacao.status());

        }

        document.add(table);

        document.close();

        return new ByteArrayInputStream(
                out.toByteArray()
        );

    }

}