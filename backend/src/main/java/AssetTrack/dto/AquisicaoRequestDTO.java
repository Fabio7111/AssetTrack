package AssetTrack.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AquisicaoRequestDTO(
        String fornecedor,
        LocalDate dataCompra,
        String numeroNotaFiscal,
        BigDecimal valorTotal
) {}