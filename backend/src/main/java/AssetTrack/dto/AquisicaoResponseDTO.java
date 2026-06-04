package AssetTrack.dto;

import AssetTrack.model.Aquisicao;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record AquisicaoResponseDTO(
        UUID idAquisicao,
        String fornecedor,
        LocalDate dataCompra,
        String numeroNotaFiscal,
        BigDecimal valorTotal
) {
    public AquisicaoResponseDTO(Aquisicao a) {
        this(a.getIdAquisicao(), a.getFornecedor(), a.getDataCompra(), a.getNumeroNotaFiscal(), a.getValorTotal());
    }
}