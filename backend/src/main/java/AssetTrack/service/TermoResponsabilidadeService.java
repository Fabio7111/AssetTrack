package AssetTrack.service;

import AssetTrack.dto.TermoResponsabilidadeRequestDTO;
import AssetTrack.dto.TermoResponsabilidadeResponseDTO;
import AssetTrack.model.Equipamento;
import AssetTrack.model.TermoResponsabilidade;
import AssetTrack.model.Usuario;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.TermoResponsabilidadeRepository;
import AssetTrack.repository.UsuarioRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class TermoResponsabilidadeService {

    @Autowired private TermoResponsabilidadeRepository termoRepository;
    @Autowired private EquipamentoRepository           equipamentoRepository;
    @Autowired private UsuarioRepository               usuarioRepository;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public List<TermoResponsabilidadeResponseDTO> listarTodos() {
        return termoRepository.findAllByOrderByDataEmissaoDesc().stream()
                .map(TermoResponsabilidadeResponseDTO::new)
                .toList();
    }

    public List<TermoResponsabilidadeResponseDTO> listarPorEquipamento(UUID idEquipamento) {
        return termoRepository.findByEquipamento_IdEquipamentoOrderByDataEmissaoDesc(idEquipamento).stream()
                .map(TermoResponsabilidadeResponseDTO::new)
                .toList();
    }

    @Transactional
    public TermoResponsabilidadeResponseDTO emitir(TermoResponsabilidadeRequestDTO data) {
        Equipamento eq = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));
        Usuario usuario = usuarioRepository.findById(data.idUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        TermoResponsabilidade termo = new TermoResponsabilidade();
        termo.setEquipamento(eq);
        termo.setUsuario(usuario);
        termo.setDataEmissao(LocalDateTime.now());
        termo.setStatusTermo("ATIVO");
        termoRepository.save(termo);

        return new TermoResponsabilidadeResponseDTO(termo);
    }

    public byte[] gerarPdf(UUID idTermo) {
        TermoResponsabilidade t = termoRepository.findById(idTermo)
                .orElseThrow(() -> new IllegalArgumentException("Termo não encontrado."));

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document doc = new Document(PageSize.A4, 56, 56, 64, 56);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font fTitulo  = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 78, 76));
            Font fSub     = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(90, 90, 90));
            Font fLabel   = new Font(Font.HELVETICA, 11, Font.BOLD,  new Color(40, 40, 40));
            Font fTexto   = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(40, 40, 40));
            Font fCorpo   = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(60, 60, 60));

            Paragraph titulo = new Paragraph("TERMO DE RESPONSABILIDADE", fTitulo);
            titulo.setAlignment(Element.ALIGN_CENTER);
            doc.add(titulo);

            Paragraph sub = new Paragraph("AssetTrack — Gestão de Ativos de TI", fSub);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(25);
            doc.add(sub);

            doc.add(linha("Responsável: ", t.getUsuario().getNome(), fLabel, fTexto));
            doc.add(linha("Equipamento: ", t.getEquipamento().getNomeEquipamento(), fLabel, fTexto));
            doc.add(linha("Nº de Série: ", t.getEquipamento().getNumeroSerie() != null ? t.getEquipamento().getNumeroSerie() : "—", fLabel, fTexto));
            String setor = t.getEquipamento().getSetor() != null ? t.getEquipamento().getSetor().getNomeSetor() : "—";
            doc.add(linha("Setor: ", setor, fLabel, fTexto));
            doc.add(linha("Data de Emissão: ", t.getDataEmissao().format(FMT), fLabel, fTexto));

            Paragraph espaco = new Paragraph(" ");
            espaco.setSpacingAfter(15);
            doc.add(espaco);

            String texto = "Declaro que recebi o equipamento acima identificado, em perfeitas condições "
                    + "de uso, comprometendo-me a zelar pela sua guarda e conservação. Responsabilizo-me "
                    + "por quaisquer danos decorrentes de mau uso, negligência ou extravio, durante o período "
                    + "em que o equipamento estiver sob a minha responsabilidade. Comprometo-me, ainda, a "
                    + "devolvê-lo quando solicitado pela área de Tecnologia da Informação ou ao término do vínculo.";
            Paragraph corpo = new Paragraph(texto, fCorpo);
            corpo.setAlignment(Element.ALIGN_JUSTIFIED);
            corpo.setSpacingAfter(50);
            doc.add(corpo);

            Paragraph ass1 = new Paragraph("_______________________________________", fTexto);
            ass1.setAlignment(Element.ALIGN_CENTER);
            doc.add(ass1);
            Paragraph nome = new Paragraph(t.getUsuario().getNome(), fTexto);
            nome.setAlignment(Element.ALIGN_CENTER);
            nome.setSpacingAfter(35);
            doc.add(nome);

            Paragraph ass2 = new Paragraph("_______________________________________", fTexto);
            ass2.setAlignment(Element.ALIGN_CENTER);
            doc.add(ass2);
            Paragraph resp = new Paragraph("Responsável de TI", fTexto);
            resp.setAlignment(Element.ALIGN_CENTER);
            doc.add(resp);

            doc.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Erro ao gerar o PDF do termo.", e);
        }
    }

    private Paragraph linha(String label, String valor, Font fLabel, Font fTexto) {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label, fLabel));
        p.add(new Chunk(valor, fTexto));
        p.setSpacingAfter(8);
        return p;
    }
}