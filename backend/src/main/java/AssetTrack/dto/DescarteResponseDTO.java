package AssetTrack.dto;

import AssetTrack.model.Descarte;
import java.time.LocalDateTime;
import java.util.UUID;

public record DescarteResponseDTO(
        UUID idDescarte,
        String equipamento,
        String autorizador,
        LocalDateTime dataDescarte,
        String motivoDescarte
) {
    public DescarteResponseDTO(Descarte d) {
        this(
                d.getIdDescarte(),
                d.getEquipamento().getNomeEquipamento(),
                d.getAutorizador().getNome(),
                d.getDataDescarte(),
                d.getMotivoDescarte()
        );
    }
}